package com.medicence.supplies.dto;

import com.medicence.supplies.domain.Role;

public record UserProfileResponse(
        Long id,
        String username,
        Role role,
        String email,
        String fullName,
        String phone,
        String address,
        boolean notifyOrders,
        boolean notifyStock
) {
}
