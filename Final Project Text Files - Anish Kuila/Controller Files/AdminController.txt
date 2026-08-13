package com.csye6220.medshop.controller;

import com.csye6220.medshop.model.Med;
import com.csye6220.medshop.service.MedService;
import com.csye6220.medshop.service.OrderService;
import com.csye6220.medshop.service.StockRequestService;
import com.csye6220.medshop.service.SupplierService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final MedService medService;
    private final OrderService orderService;
    private final SupplierService supplierService;
    private final StockRequestService stockRequestService;

    @Autowired
    public AdminController(MedService medService, OrderService orderService, SupplierService supplierService, StockRequestService stockRequestService) {
        this.medService = medService;
        this.orderService = orderService;
        this.supplierService = supplierService;
        this.stockRequestService = stockRequestService;
    }

    // View all medications
    @GetMapping("/medications")
    public String viewAllMedications(Model model) {
        List<Med> meds = medService.findAll();
        model.addAttribute("meds", meds);
        return "adminMedications";
    }

    // Add or update medication
    @GetMapping("/medications/add")
    public String showAddMedForm(Model model) {
        model.addAttribute("med", new Med());
        return "addMed";
    }

    @PostMapping("/medications/add")
    public String addOrUpdateMed(@ModelAttribute("med") Med med) {
        System.out.println("Received Med: " + med);
        medService.addMed(med);
        return "redirect:/admin/medications";
    }

    // Show remove medication page
    @GetMapping("/medications/remove")
    public String showRemoveMedicationsPage(Model model) {
        List<Med> meds = medService.findAll();
        model.addAttribute("meds", meds);
        return "removeMed";
    }

    // Process medication removal
    @PostMapping("/medications/remove")
    public String removeMedications(@RequestParam("medIds") List<Integer> medIds) {
        for (int id : medIds) {
            medService.delete(id);
        }
        return "redirect:/admin/medications";
    }
    
    // View and process orders
    @GetMapping("/orders")
    public String viewOrders(Model model) {
        model.addAttribute("orders", orderService.getAllOrders());
        return "adminOrders";
    }

    @PostMapping("/orders/{orderId}/process")
    public String processOrder(@PathVariable int orderId) {
        orderService.processOrder(orderId);
        return "redirect:/admin/orders";
    }

    // View low stock medications
    @GetMapping("/low-stock")
    public String viewLowStockMedications(Model model) {
        List<Med> lowStockMeds = medService.findLowStockMedications();
        model.addAttribute("lowStockMeds", lowStockMeds);
        return "lowStockMeds";
    }
    
    @PostMapping("/medications/request-stock")
    public String requestStock(@RequestParam("medId") int medId,
                               @RequestParam("quantity") int quantity,
                               RedirectAttributes redirectAttributes) {
        stockRequestService.addStockRequest(medId, quantity);
        redirectAttributes.addFlashAttribute("message", "Stock request sent successfully!");
        return "redirect:/admin/low-stock";
    }
}


