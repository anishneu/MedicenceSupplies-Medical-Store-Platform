package com.medicence.supplies.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.medicence.supplies.domain.Medication;
import com.medicence.supplies.domain.Order;
import com.medicence.supplies.domain.OrderStatus;
import com.medicence.supplies.domain.Role;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.dto.OrderItemRequest;
import com.medicence.supplies.dto.PlaceOrderRequest;
import com.medicence.supplies.exception.ApiException;
import com.medicence.supplies.repository.OrderRepository;
import com.medicence.supplies.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private MedicationService medicationService;

    @InjectMocks
    private OrderService orderService;

    private User customer;
    private Medication med;

    @BeforeEach
    void setUp() {
        customer = new User("customer", "hash", Role.CUSTOMER);
        customer.setId(1L);
        med = new Medication("Ibuprofen", "Pain Relief", new BigDecimal("6.49"), 10);
        med.setId(2L);
    }

    @Test
    void placeOrderDecrementsStock() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(medicationService.getEntity(2L)).thenReturn(med);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order order = inv.getArgument(0);
            order.setId(99L);
            return order;
        });

        var response = orderService.placeOrder(1L, new PlaceOrderRequest(List.of(new OrderItemRequest(2L, 3))));

        assertThat(med.getStock()).isEqualTo(7);
        assertThat(response.status()).isEqualTo(OrderStatus.PENDING);
        assertThat(response.items()).hasSize(1);

        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        assertThat(captor.getValue().getItems()).hasSize(1);
    }

    @Test
    void placeOrderRejectsInsufficientStock() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(medicationService.getEntity(2L)).thenReturn(med);

        assertThatThrownBy(() ->
                orderService.placeOrder(1L, new PlaceOrderRequest(List.of(new OrderItemRequest(2L, 50)))))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Insufficient stock");
    }
}
