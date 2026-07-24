package com.tutorlink.user.dto;

import com.tutorlink.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotNull private Long userId;
    @NotNull private String firstName;
    @NotNull private String lastName;
    @Email @NotNull private String email;
    @NotNull private Role role;
    @NotBlank private String phone;
}