package com.tutorlink.tutorservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinGroupRequest {

    @NotNull
    private Long studentId;
}