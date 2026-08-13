package com.medicence.supplies.controller;

import com.medicence.supplies.dto.MedicationResponse;
import com.medicence.supplies.dto.StockRequestCreate;
import com.medicence.supplies.dto.StockRequestResponse;
import com.medicence.supplies.dto.UpdateStockRequest;
import com.medicence.supplies.security.UserPrincipal;
import com.medicence.supplies.service.MedicationService;
import com.medicence.supplies.service.StockRequestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StockController {

    private final StockRequestService stockRequestService;
    private final MedicationService medicationService;

    public StockController(StockRequestService stockRequestService, MedicationService medicationService) {
        this.stockRequestService = stockRequestService;
        this.medicationService = medicationService;
    }

    @PostMapping("/admin/stock-requests")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public StockRequestResponse createRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StockRequestCreate request) {
        return stockRequestService.create(principal.getId(), request);
    }

    @GetMapping("/admin/stock-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public List<StockRequestResponse> adminList() {
        return stockRequestService.findAll();
    }

    @GetMapping("/supplier/stock-requests")
    @PreAuthorize("hasRole('SUPPLIER')")
    public List<StockRequestResponse> supplierList() {
        return stockRequestService.findPending();
    }

    @PostMapping("/supplier/stock-requests/{id}/approve")
    @PreAuthorize("hasRole('SUPPLIER')")
    public StockRequestResponse approve(@PathVariable Long id) {
        return stockRequestService.approve(id);
    }

    @PostMapping("/supplier/stock-requests/{id}/reject")
    @PreAuthorize("hasRole('SUPPLIER')")
    public StockRequestResponse reject(@PathVariable Long id) {
        return stockRequestService.reject(id);
    }

    @PostMapping("/supplier/stock")
    @PreAuthorize("hasRole('SUPPLIER')")
    public MedicationResponse updateStock(@Valid @RequestBody UpdateStockRequest request) {
        return medicationService.updateStock(request.medicationId(), request.stock());
    }
}
