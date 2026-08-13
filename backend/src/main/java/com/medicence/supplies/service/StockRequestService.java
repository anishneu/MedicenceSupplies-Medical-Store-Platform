package com.medicence.supplies.service;

import com.medicence.supplies.domain.Medication;
import com.medicence.supplies.domain.StockRequest;
import com.medicence.supplies.domain.StockRequestStatus;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.StockRequestCreate;
import com.medicence.supplies.dto.StockRequestResponse;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.StockRequestRepository;
import com.medicence.supplies.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StockRequestService {

    private final StockRequestRepository stockRequestRepository;
    private final UserRepository userRepository;
    private final MedicationService medicationService;

    public StockRequestService(
            StockRequestRepository stockRequestRepository,
            UserRepository userRepository,
            MedicationService medicationService) {
        this.stockRequestRepository = stockRequestRepository;
        this.userRepository = userRepository;
        this.medicationService = medicationService;
    }

    @Transactional
    public StockRequestResponse create(Long adminUserId, StockRequestCreate request) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));
        Medication med = medicationService.getEntity(request.medicationId());
        StockRequest stockRequest = new StockRequest(med, admin, request.requestedQuantity());
        return toResponse(stockRequestRepository.save(stockRequest));
    }

    @Transactional(readOnly = true)
    public List<StockRequestResponse> findAll() {
        return stockRequestRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<StockRequestResponse> findPending() {
        return stockRequestRepository.findByStatusOrderByCreatedAtDesc(StockRequestStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public StockRequestResponse approve(Long id) {
        StockRequest request = getPending(id);
        Medication med = request.getMedication();
        medicationService.updateStock(med.getId(), med.getStock() + request.getRequestedQuantity());
        request.setStatus(StockRequestStatus.APPROVED);
        return toResponse(request);
    }

    @Transactional
    public StockRequestResponse reject(Long id) {
        StockRequest request = getPending(id);
        request.setStatus(StockRequestStatus.REJECTED);
        return toResponse(request);
    }

    private StockRequest getPending(Long id) {
        StockRequest request = stockRequestRepository.findById(id)
                .orElseThrow(() -> new ApiException("Stock request not found", HttpStatus.NOT_FOUND.value()));
        if (request.getStatus() != StockRequestStatus.PENDING) {
            throw new ApiException("Stock request is not pending", HttpStatus.BAD_REQUEST.value());
        }
        return request;
    }

    private StockRequestResponse toResponse(StockRequest request) {
        return new StockRequestResponse(
                request.getId(),
                request.getMedication().getId(),
                request.getMedication().getName(),
                request.getRequestedQuantity(),
                request.getStatus(),
                request.getRequestedBy().getUsername(),
                request.getCreatedAt()
        );
    }
}
