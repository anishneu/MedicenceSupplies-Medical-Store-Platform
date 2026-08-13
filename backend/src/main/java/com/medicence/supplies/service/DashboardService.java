package com.medicence.supplies.service;

import com.medicence.supplies.domain.OrderStatus;
import com.medicence.supplies.domain.StockRequestStatus;
import com.medicence.supplies.dto.DashboardStatsResponse;
import com.medicence.supplies.repository.OrderRepository;
import com.medicence.supplies.repository.StockRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final MedicationService medicationService;
    private final OrderRepository orderRepository;
    private final StockRequestRepository stockRequestRepository;
    private final SupportTicketService supportTicketService;

    public DashboardService(
            MedicationService medicationService,
            OrderRepository orderRepository,
            StockRequestRepository stockRequestRepository,
            SupportTicketService supportTicketService) {
        this.medicationService = medicationService;
        this.orderRepository = orderRepository;
        this.stockRequestRepository = stockRequestRepository;
        this.supportTicketService = supportTicketService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse stats() {
        return new DashboardStatsResponse(
                medicationService.count(),
                medicationService.countLowStock(20),
                orderRepository.countByStatus(OrderStatus.PENDING),
                stockRequestRepository.countByStatus(StockRequestStatus.PENDING),
                supportTicketService.countOpen()
        );
    }
}
