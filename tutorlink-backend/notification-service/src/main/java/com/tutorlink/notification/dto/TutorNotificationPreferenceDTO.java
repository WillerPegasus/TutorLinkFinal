package com.tutorlink.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TutorNotificationPreferenceDTO {
    private Boolean smsNewRequest;
    private Boolean smsPaymentReceived;
    private Boolean smsNewReview;
    private Boolean emailWeeklySummary;
    private Boolean emailNewRequest;
}