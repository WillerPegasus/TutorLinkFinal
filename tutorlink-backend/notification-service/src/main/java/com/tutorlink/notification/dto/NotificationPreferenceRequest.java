package com.tutorlink.notification.dto;

import lombok.Data;

@Data
public class NotificationPreferenceRequest {
    private Boolean emailEnabled;
    private Boolean smsEnabled;
    private Boolean bookingUpdates;
    private Boolean promotions;
}