package com.tutorlink.tutorservice.dto;

import com.tutorlink.tutorservice.entity.GroupMembership.MembershipStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class GroupMembershipResponse {
    private Long id;
    private Long groupId;
    private Long studentId;
    private LocalDateTime joinedAt;
    private MembershipStatus status;
    private LocalDate lastPaymentDate;
    private boolean upToDate;
}