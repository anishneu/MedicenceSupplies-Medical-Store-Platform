package com.medicence.supplies.dto;

import com.medicence.supplies.domain.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String username,
        Instant orderDate,
        OrderStatus status,
        List<OrderItemResponse> items,
        BigDecimal total
) {
}
