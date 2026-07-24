package com.tutorlink.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ✎ AJOUT — un point du graphique de revenus mensuels
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyRevenuePoint {
    private String month;   // format "2026-07"
    private long revenue;
}