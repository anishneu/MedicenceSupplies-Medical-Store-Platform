package com.medicence.supplies.repository;

import com.medicence.supplies.domain.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
            select oi.medication.id, coalesce(sum(oi.quantity), 0)
            from OrderItem oi
            group by oi.medication.id
            """)
    List<Object[]> sumOrderedQuantitiesByMedication();
}
