package com.medicence.supplies.service;

import com.medicence.supplies.domain.Role;
import com.medicence.supplies.domain.Supplier;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.AuthResponse;
import com.medicence.supplies.dto.LoginRequest;
import com.medicence.supplies.dto.RegisterRequest;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.SupplierRepository;
import com.medicence.supplies.repository.UserRepository;
import com.medicence.supplies.security.JwtService;
import com.medicence.supplies.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            SupplierRepository supplierRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new ApiException("Cannot self-register as ADMIN", HttpStatus.BAD_REQUEST.value());
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new ApiException("Username already taken", HttpStatus.CONFLICT.value());
        }
        if (request.role() == Role.SUPPLIER
                && (request.supplierName() == null || request.supplierName().isBlank())) {
            throw new ApiException("Supplier name is required", HttpStatus.BAD_REQUEST.value());
        }

        User user = new User(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.role()
        );
        userRepository.save(user);

        if (request.role() == Role.SUPPLIER) {
            supplierRepository.save(new Supplier(
                    request.supplierName().trim(),
                    request.contactInfo(),
                    user
            ));
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));
        UserPrincipal principal = new UserPrincipal(user);
        return new AuthResponse(
                jwtService.generateToken(principal),
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}
