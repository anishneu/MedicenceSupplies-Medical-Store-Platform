package com.medicence.supplies.service;

import com.medicence.supplies.domain.SupportTicket;
import com.medicence.supplies.domain.SupportTicketStatus;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.SupportTicketRequest;
import com.medicence.supplies.dto.SupportTicketResponse;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.SupportTicketRepository;
import com.medicence.supplies.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;

    public SupportTicketService(SupportTicketRepository supportTicketRepository, UserRepository userRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SupportTicketResponse create(Long userId, SupportTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));
        SupportTicket ticket = new SupportTicket(user, request.subject(), request.message(), request.category());
        return toResponse(supportTicketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> findMine(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));
        return supportTicketRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> findAll() {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public SupportTicketResponse updateStatus(Long id, SupportTicketStatus status) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new ApiException("Ticket not found", HttpStatus.NOT_FOUND.value()));
        ticket.setStatus(status);
        return toResponse(ticket);
    }

    public long countOpen() {
        return supportTicketRepository.findAll().stream()
                .filter(t -> t.getStatus() == SupportTicketStatus.OPEN || t.getStatus() == SupportTicketStatus.IN_PROGRESS)
                .count();
    }

    private SupportTicketResponse toResponse(SupportTicket ticket) {
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getMessage(),
                ticket.getCategory(),
                ticket.getStatus(),
                ticket.getUser().getUsername(),
                ticket.getCreatedAt()
        );
    }
}
