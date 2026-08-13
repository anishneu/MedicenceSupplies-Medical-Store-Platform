package com.medicence.supplies.dto;

import com.medicence.supplies.domain.Role;

public record AuthResponse(
        String token,
        Long userId,
        String username,
        Role role
) {
}
