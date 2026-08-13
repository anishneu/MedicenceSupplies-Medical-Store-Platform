package com.medicence.supplies.service;

import com.medicence.supplies.domain.Medication;
import com.medicence.supplies.dto.MedicationRequest;
import com.medicence.supplies.dto.MedicationResponse;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.MedicationRepository;
import com.medicence.supplies.repository.OrderItemRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final OrderItemRepository orderItemRepository;

    public MedicationService(MedicationRepository medicationRepository, OrderItemRepository orderItemRepository) {
        this.medicationRepository = medicationRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public List<MedicationResponse> findAll() {
        Map<Long, Long> ordered = orderedQuantities();
        return medicationRepository.findAll().stream()
                .map(med -> toResponse(med, ordered.getOrDefault(med.getId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MedicationResponse> findLowStock(int threshold) {
        Map<Long, Long> ordered = orderedQuantities();
        return medicationRepository.findByStockLessThan(threshold).stream()
                .map(med -> toResponse(med, ordered.getOrDefault(med.getId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public MedicationResponse findById(Long id) {
        Medication med = getEntity(id);
        return toResponse(med, orderedQuantities().getOrDefault(id, 0L));
    }

    @Transactional
    public MedicationResponse create(MedicationRequest request) {
        Medication med = new Medication(
                request.name(),
                request.category(),
                request.price(),
                request.stock(),
                request.description(),
                request.imageUrl(),
                Boolean.TRUE.equals(request.featured())
        );
        return toResponse(medicationRepository.save(med), 0L);
    }

    @Transactional
    public MedicationResponse update(Long id, MedicationRequest request) {
        Medication med = getEntity(id);
        med.setName(request.name());
        med.setCategory(request.category());
        med.setPrice(request.price());
        med.setStock(request.stock());
        med.setDescription(request.description());
        med.setImageUrl(request.imageUrl());
        if (request.featured() != null) {
            med.setFeatured(request.featured());
        }
        return toResponse(med, orderedQuantities().getOrDefault(id, 0L));
    }

    @Transactional
    public void delete(Long id) {
        if (!medicationRepository.existsById(id)) {
            throw new ApiException("Medication not found", HttpStatus.NOT_FOUND.value());
        }
        medicationRepository.deleteById(id);
    }

    @Transactional
    public MedicationResponse updateStock(Long id, Integer stock) {
        Medication med = getEntity(id);
        med.setStock(stock);
        return toResponse(med, orderedQuantities().getOrDefault(id, 0L));
    }

    public long count() {
        return medicationRepository.count();
    }

    public long countLowStock(int threshold) {
        return medicationRepository.findByStockLessThan(threshold).size();
    }

    public Medication getEntity(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new ApiException("Medication not found", HttpStatus.NOT_FOUND.value()));
    }

    private Map<Long, Long> orderedQuantities() {
        Map<Long, Long> map = new HashMap<>();
        for (Object[] row : orderItemRepository.sumOrderedQuantitiesByMedication()) {
            map.put((Long) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }

    private MedicationResponse toResponse(Medication med, long timesOrdered) {
        return new MedicationResponse(
                med.getId(),
                med.getName(),
                med.getCategory(),
                med.getPrice(),
                med.getStock(),
                med.getDescription(),
                med.getImageUrl(),
                med.isFeatured(),
                timesOrdered
        );
    }
}
