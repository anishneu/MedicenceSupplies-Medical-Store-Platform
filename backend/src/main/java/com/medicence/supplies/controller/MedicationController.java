package com.medicence.supplies.controller;

import com.medicence.supplies.dto.MedicationRequest;
import com.medicence.supplies.dto.MedicationResponse;
import com.medicence.supplies.service.MedicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public List<MedicationResponse> list() {
        return medicationService.findAll();
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN','SUPPLIER')")
    public List<MedicationResponse> lowStock(@RequestParam(defaultValue = "20") int threshold) {
        return medicationService.findLowStock(threshold);
    }

    @GetMapping("/{id}")
    public MedicationResponse get(@PathVariable Long id) {
        return medicationService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public MedicationResponse create(@Valid @RequestBody MedicationRequest request) {
        return medicationService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MedicationResponse update(@PathVariable Long id, @Valid @RequestBody MedicationRequest request) {
        return medicationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        medicationService.delete(id);
    }
}
