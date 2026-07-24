package com.tutorlink.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatsResponse {
    private long totalBrut;
    private long totalCommission;
    private long totalNet;
    private long totalIndividuel;   // = totalBrut ici (cours individuels seulement)
    private long totalGroupe;       // ⚠️ toujours 0 pour l'instant, voir note plus bas
    private long completedCount;
    private long pendingRevenue;
    private double evolution;       // % vs période précédente de même longueur
}