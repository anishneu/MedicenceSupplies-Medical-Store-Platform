package com.medicence.supplies.dto;

import java.math.BigDecimal;

public record MedicationResponse(
        Long id,
        String name,
        String category,
        BigDecimal price,
        Integer stock,
        String description,
        String imageUrl,
        boolean featured,
        long timesOrdered
) {
}
