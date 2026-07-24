package com.tutorlink.messageservice.controller;

import com.tutorlink.messageservice.dto.MessageResponse;
import com.tutorlink.messageservice.dto.SendMessageRequest;
import com.tutorlink.messageservice.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {

    private final MessageService messageService;

    // Destination d'envoi frontend : /app/chat.send
    // Topic d'écoute frontend : /topic/messages/{receiverId}
    @MessageMapping("/chat.send")
    public void sendMessage(SendMessageRequest request) {
        // sendMessage() dans le service broadcaster déjà vers /topic/messages/{receiverId}
        messageService.sendMessage(request);
    }
}