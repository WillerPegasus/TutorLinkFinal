package com.tutorlink.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceResponse {
    private Boolean emailEnabled;
    private Boolean smsEnabled;
    private Boolean bookingUpdates;
    private Boolean promotions;
}