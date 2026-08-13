package com.medicence.supplies.service;

import com.medicence.supplies.domain.Medication;
import com.medicence.supplies.domain.Order;
import com.medicence.supplies.domain.OrderItem;
import com.medicence.supplies.domain.OrderStatus;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.OrderItemRequest;
import com.medicence.supplies.dto.OrderItemResponse;
import com.medicence.supplies.dto.OrderResponse;
import com.medicence.supplies.dto.PlaceOrderRequest;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.OrderRepository;
import com.medicence.supplies.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MedicationService medicationService;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            MedicationService medicationService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.medicationService = medicationService;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));

        Order order = new Order();
        order.setUser(user);

        for (OrderItemRequest itemReq : request.items()) {
            Medication med = medicationService.getEntity(itemReq.medicationId());
            if (med.getStock() < itemReq.quantity()) {
                throw new ApiException(
                        "Insufficient stock for " + med.getName(),
                        HttpStatus.BAD_REQUEST.value());
            }
            med.setStock(med.getStock() - itemReq.quantity());
            order.addItem(new OrderItem(med, itemReq.quantity(), med.getPrice()));
        }

        return toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findMyOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND.value()));
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse process(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND.value()));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ApiException("Only pending orders can be processed", HttpStatus.BAD_REQUEST.value());
        }
        order.setStatus(OrderStatus.PROCESSED);
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getMedication().getId(),
                        i.getMedication().getName(),
                        i.getQuantity(),
                        i.getUnitPrice()))
                .toList();
        BigDecimal total = items.stream()
                .map(i -> i.unitPrice().multiply(BigDecimal.valueOf(i.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getOrderDate(),
                order.getStatus(),
                items,
                total
        );
    }
}
