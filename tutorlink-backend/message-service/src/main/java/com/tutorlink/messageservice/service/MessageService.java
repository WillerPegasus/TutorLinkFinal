package com.tutorlink.messageservice.service;

import com.tutorlink.messageservice.dto.*;
import com.tutorlink.messageservice.entity.*;
import com.tutorlink.messageservice.exception.*;
import com.tutorlink.messageservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Envoyer un message (REST + WebSocket broadcast)
    public MessageResponse sendMessage(SendMessageRequest request) {
        // Trouver ou créer la conversation
        Conversation conversation = conversationRepository
                .findByParticipants(request.getSenderId(), request.getReceiverId())
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder()
                                .participantOneId(request.getSenderId())
                                .participantTwoId(request.getReceiverId())
                                .build()
                ));

        // Créer le message
        Message message = Message.builder()
                .conversationId(conversation.getId())
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        // Mettre à jour lastMessageAt de la conversation
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageResponse response = toMessageResponse(message);

        // Broadcaster via WebSocket vers le destinataire
        messagingTemplate.convertAndSend(
                "/topic/messages/" + request.getReceiverId(),
                response
        );

        return response;
    }

    // Historique entre deux utilisateurs
    public List<MessageResponse> getConversationMessages(Long userA, Long userB) {
        Conversation conversation = conversationRepository
                .findByParticipants(userA, userB)
                .orElseThrow(() -> new ConversationNotFoundException(
                        "Aucune conversation entre " + userA + " et " + userB));

        return messageRepository
                .findByConversationIdOrderBySentAtAsc(conversation.getId())
                .stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    // Toutes les conversations d'un utilisateur
    public List<ConversationResponse> getConversationsByUser(Long userId) {
        return conversationRepository
                .findByParticipantOneIdOrParticipantTwoIdOrderByLastMessageAtDesc(userId, userId)
                .stream()
                .map(conv -> {
                    // Dernier message de la conversation
                    List<Message> messages = messageRepository
                            .findByConversationIdOrderBySentAtAsc(conv.getId());

                    String lastMsg = messages.isEmpty() ? "" :
                            messages.get(messages.size() - 1).getContent();

                    Long unread = messageRepository
                            .countByConversationIdAndReceiverIdAndIsReadFalse(conv.getId(), userId);
                    return ConversationResponse.builder()
                            .id(conv.getId())
                            .participantOneId(conv.getParticipantOneId())
                            .participantTwoId(conv.getParticipantTwoId())
                            .lastMessage(lastMsg)
                            .lastMessageAt(conv.getLastMessageAt())
                            .unreadCount(unread.intValue())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Marquer un message comme lu
    public MessageResponse markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(
                        "Message introuvable : " + messageId));
        message.setIsRead(true);
        return toMessageResponse(messageRepository.save(message));
    }

    // Nombre de messages non lus
    public Long getUnreadCount(Long userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    // Mapper entité → DTO
    private MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .isRead(message.getIsRead())
                .sentAt(message.getSentAt())
                .build();
    }
}