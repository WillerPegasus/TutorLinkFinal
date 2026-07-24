package com.tutorlink.messageservice.controller;

import com.tutorlink.messageservice.dto.*;
import com.tutorlink.messageservice.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // GET /api/messages/conversations/{userId}
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getConversationsByUser(userId));
    }

    // GET /api/messages/conversation/{userA}/{userB}
    @GetMapping("/conversation/{userA}/{userB}")
    public ResponseEntity<List<MessageResponse>> getConversationHistory(
            @PathVariable Long userA,
            @PathVariable Long userB) {
        return ResponseEntity.ok(messageService.getConversationMessages(userA, userB));
    }

    // POST /api/messages/send (fallback REST)
    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    // PATCH /api/messages/{messageId}/read
    @PatchMapping("/{messageId}/read")
    public ResponseEntity<MessageResponse> markAsRead(
            @PathVariable Long messageId) {
        return ResponseEntity.ok(messageService.markAsRead(messageId));
    }

    // GET /api/messages/unread/{userId}
    @GetMapping("/unread/{userId}")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getUnreadCount(userId));
    }
}