package com.medicence.supplies.controller;

import com.medicence.supplies.domain.SupportTicketStatus;
import com.medicence.supplies.dto.SupportTicketRequest;
import com.medicence.supplies.dto.SupportTicketResponse;
import com.medicence.supplies.security.UserPrincipal;
import com.medicence.supplies.service.SupportTicketService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportTicketService supportTicketService;

    public SupportController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @PostMapping("/tickets")
    @ResponseStatus(HttpStatus.CREATED)
    public SupportTicketResponse create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SupportTicketRequest request) {
        return supportTicketService.create(principal.getId(), request);
    }

    @GetMapping("/tickets/mine")
    public List<SupportTicketResponse> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return supportTicketService.findMine(principal.getId());
    }

    @GetMapping("/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SupportTicketResponse> all() {
        return supportTicketService.findAll();
    }

    @PutMapping("/tickets/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public SupportTicketResponse updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        SupportTicketStatus status = SupportTicketStatus.valueOf(body.get("status"));
        return supportTicketService.updateStatus(id, status);
    }
}
