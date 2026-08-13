package com.medicence.supplies.dto;

import com.medicence.supplies.domain.SupportTicketStatus;
import java.time.Instant;

public record SupportTicketResponse(
        Long id,
        String subject,
        String message,
        String category,
        SupportTicketStatus status,
        String username,
        Instant createdAt
) {
}
