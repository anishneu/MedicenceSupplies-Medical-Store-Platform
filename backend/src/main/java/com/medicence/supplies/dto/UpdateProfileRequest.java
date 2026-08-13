package com.medicence.supplies.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Email @Size(max = 120) String email,
        @Size(max = 120) String fullName,
        @Size(max = 40) String phone,
        @Size(max = 255) String address,
        Boolean notifyOrders,
        Boolean notifyStock
) {
}
