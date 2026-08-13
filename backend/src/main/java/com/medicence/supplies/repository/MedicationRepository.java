package com.medicence.supplies.repository;

import com.medicence.supplies.domain.Medication;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByStockLessThan(Integer threshold);
}
