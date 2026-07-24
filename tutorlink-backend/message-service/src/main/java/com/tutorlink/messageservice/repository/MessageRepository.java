package com.tutorlink.messageservice.repository;

import com.tutorlink.messageservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderBySentAtAsc(Long conversationId);

    List<Message> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    Long countByReceiverIdAndIsReadFalse(Long receiverId);
    Long countByConversationIdAndReceiverIdAndIsReadFalse(Long conversationId, Long receiverId);
}