package com.medicence.supplies.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long medicationId,
        String medicationName,
        Integer quantity,
        BigDecimal unitPrice
) {
}
