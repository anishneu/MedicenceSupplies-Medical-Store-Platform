package com.medicence.supplies.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateStockRequest(
        @NotNull Long medicationId,
        @NotNull @Min(0) Integer stock
) {
}
