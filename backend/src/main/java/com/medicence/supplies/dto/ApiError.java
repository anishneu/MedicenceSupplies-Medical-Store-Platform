package com.medicence.supplies.dto;

public record ApiError(
        String message,
        int status,
        String path
) {
}
