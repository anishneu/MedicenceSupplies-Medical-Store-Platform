package com.medicence.supplies.repository;

import com.medicence.supplies.domain.Supplier;
import com.medicence.supplies.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByUser(User user);
}
