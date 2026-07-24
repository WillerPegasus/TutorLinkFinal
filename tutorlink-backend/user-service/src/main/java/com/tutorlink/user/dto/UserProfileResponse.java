package com.tutorlink.user.dto;

import com.tutorlink.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.tutorlink.user.entity.AccountStatus; // ✎ AJOUT V4

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String profilePicture;
    private String city;
    private String districts;
    private Role role;
    private String bio;
    private AccountStatus status; // ✎ AJOUT V4
    private LocalDateTime createdAt;
}