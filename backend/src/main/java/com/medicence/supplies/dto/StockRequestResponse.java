package com.medicence.supplies.dto;

import com.medicence.supplies.domain.StockRequestStatus;
import java.time.Instant;

public record StockRequestResponse(
        Long id,
        Long medicationId,
        String medicationName,
        Integer requestedQuantity,
        StockRequestStatus status,
        String requestedBy,
        Instant createdAt
) {
}
