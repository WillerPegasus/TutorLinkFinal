package com.tutorlink.tutorservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GroupRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String subject;

    @NotBlank
    private String level;

    private String city;
    private String district;

    @NotNull
    private Integer maxCapacity;

    @NotNull
    private Integer monthlyPrice;

    private String description;
    private String schedules;
}