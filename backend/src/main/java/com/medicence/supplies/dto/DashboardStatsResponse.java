package com.medicence.supplies.dto;

public record DashboardStatsResponse(
        long medicationCount,
        long lowStockCount,
        long pendingOrderCount,
        long pendingStockRequestCount,
        long openTicketCount
) {
}
