package com.medicence.supplies.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.medicence.supplies.domain.Role;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.RegisterRequest;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.SupplierRepository;
import com.medicence.supplies.repository.UserRepository;
import com.medicence.supplies.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void rejectsAdminSelfRegistration() {
        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("admin2", "password123", Role.ADMIN, null, null)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("ADMIN");
    }

    @Test
    void registersCustomer() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(5L);
            return u;
        });
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.register(
                new RegisterRequest("newuser", "password123", Role.CUSTOMER, null, null));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo(Role.CUSTOMER);
        assertThat(response.username()).isEqualTo("newuser");
    }
}
