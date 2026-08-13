package com.medicence.supplies.repository;

import com.medicence.supplies.domain.StockRequest;
import com.medicence.supplies.domain.StockRequestStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRequestRepository extends JpaRepository<StockRequest, Long> {
    List<StockRequest> findByStatusOrderByCreatedAtDesc(StockRequestStatus status);
    List<StockRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(StockRequestStatus status);
}
