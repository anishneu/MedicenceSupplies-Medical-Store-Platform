package com.medicence.supplies.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockRequestCreate(
        @NotNull Long medicationId,
        @NotNull @Min(1) Integer requestedQuantity
) {
}
