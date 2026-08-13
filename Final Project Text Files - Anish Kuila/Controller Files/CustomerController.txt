package com.csye6220.medshop.controller;

import com.csye6220.medshop.model.Med;
import com.csye6220.medshop.model.Order;
import com.csye6220.medshop.model.User;
import com.csye6220.medshop.service.MedService;
import com.csye6220.medshop.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/customer")
@SessionAttributes("cart")
public class CustomerController {

    private final MedService medService;
    private final OrderService orderService;

    @Autowired
    public CustomerController(MedService medService, OrderService orderService) {
        this.medService = medService;
        this.orderService = orderService;
    }

    @ModelAttribute("cart")
    public List<Med> initializeCart() {
        return new ArrayList<>();
    }

    @GetMapping("/browse")
    public String browseMedications(Model model) {
        List<Med> medications = medService.findAll();
        model.addAttribute("medications", medications);
        return "customerBrowse";
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("id") int medicationId, 
                            @ModelAttribute("cart") List<Med> cart, 
                            Model model) {
        Med med = medService.findById(medicationId);
        if (med != null) {
            cart.add(med);
            model.addAttribute("message", med.getName() + " added to the cart.");
        } else {
            model.addAttribute("error", "Medication not found.");
        }
        return "redirect:/customer/cart";
    }

    @GetMapping("/cart")
    public String viewCart(@ModelAttribute("cart") List<Med> cart, Model model) {
        model.addAttribute("cart", cart);
        return "customerCart";
    }

    @PostMapping("/order/place")
    public String placeOrder(@RequestParam("userId") int userId, 
                             @ModelAttribute("cart") List<Med> cart, 
                             Model model) {
        if (cart.isEmpty()) {
            model.addAttribute("error", "Cart is empty. Please add items before placing an order.");
            return "customerCart";
        }

        for (Med med : cart) {
            Order order = new Order();
            order.setUserId(userId);
            order.setMedicationId(med.getId());
            order.setQuantity(1); 
            order.setOrderDate(new Date());
            order.setStatus("Pending");
            orderService.placeOrder(order);
        }

        cart.clear();
        model.addAttribute("message", "Order placed successfully!");
        return "redirect:/customer/orders?userId=" + userId;
    }

    @GetMapping("/orders")
    public String viewOrders(@SessionAttribute("user") User user, Model model) {
        int userId = user.getId();
        List<Order> orders = orderService.getOrdersByUserId(userId);
        if (orders.isEmpty()) {
            model.addAttribute("message", "No orders found.");
        } else {
            model.addAttribute("orders", orders);
        }
        return "customerOrders";
    }
}





