package com.tutorlink.tutorservice.dto;

import com.tutorlink.tutorservice.entity.Group.GroupStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class GroupResponse {
    private Long id;
    private Long tutorId;
    private String name;
    private String subject;
    private String level;
    private String city;
    private String district;
    private Integer maxCapacity;
    private Integer currentCount;
    private Integer monthlyPrice;
    private String description;
    private String schedules;
    private GroupStatus status;
    private LocalDateTime createdAt;
}