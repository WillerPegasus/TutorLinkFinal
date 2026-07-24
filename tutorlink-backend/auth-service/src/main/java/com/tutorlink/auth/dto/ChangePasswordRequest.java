package com.tutorlink.auth.dto;

public class ChangePasswordRequest {

    private String identifier;
    private String oldPassword;
    private String newPassword;

    public ChangePasswordRequest() {}

    public ChangePasswordRequest(String identifier, String oldPassword, String newPassword) {
        this.identifier = identifier;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}