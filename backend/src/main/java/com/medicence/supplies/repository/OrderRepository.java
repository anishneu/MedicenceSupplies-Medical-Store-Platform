package com.medicence.supplies.repository;

import com.medicence.supplies.domain.Order;
import com.medicence.supplies.domain.OrderStatus;
import com.medicence.supplies.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findAllByOrderByOrderDateDesc();
    long countByStatus(OrderStatus status);
}
