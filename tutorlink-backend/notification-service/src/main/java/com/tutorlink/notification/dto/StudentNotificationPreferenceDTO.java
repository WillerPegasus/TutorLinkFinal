package com.tutorlink.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StudentNotificationPreferenceDTO {
    private Boolean emailReservation;
    private Boolean emailMessage;
    private Boolean smsReminder;
    private Boolean smsPayment;
    private Boolean pushNotifications;
}