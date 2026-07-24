package com.tutorlink.user.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String profilePicture;
    private String city;
    private String districts;
    private String bio;
}