package com.tutorlink.messageservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponse {

    private Long id;
    private Long participantOneId;
    private Long participantTwoId;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
}