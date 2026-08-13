package com.medicence.supplies.repository;

import com.medicence.supplies.domain.SupportTicket;
import com.medicence.supplies.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserOrderByCreatedAtDesc(User user);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}
