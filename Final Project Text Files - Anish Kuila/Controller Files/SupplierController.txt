package com.csye6220.medshop.controller;

import com.csye6220.medshop.model.Med;
import com.csye6220.medshop.model.StockRequest;
import com.csye6220.medshop.service.MedService;
import com.csye6220.medshop.service.SupplierService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/supplier")
public class SupplierController {

    private final MedService medService;
    
    @Autowired
    private SupplierService supplierService;

    
    @Autowired
    public SupplierController(MedService medService) {
        this.medService = medService;
    }
    
    @GetMapping("/browse")
    public String browseMedications(Model model) {
        List<Med> medications = medService.findAll();
        model.addAttribute("medications", medications);
        return "supplierPortal";
    }   
    
    @GetMapping("/low-stock")
    public String viewLowStockMedications(Model model) {
        List<Med> lowStockMeds = supplierService.getLowStockMedications();
        model.addAttribute("lowStockMeds", lowStockMeds);
        return "lowStockMeds";
    }

    @PostMapping("/update-stock")
    @ResponseBody
    public ResponseEntity<String> updateStock(@RequestParam("medId") int medId,
                                              @RequestParam("newStock") int newStock) {
        supplierService.updateMedicationStock(medId, newStock);
        return ResponseEntity.ok("Stock updated successfully.");
    }
    
    @GetMapping("/view-requests")
    public String viewRequests(Model model) {
        List<StockRequest> requests = supplierService.getAllRequests();
        model.addAttribute("requests", requests);
        return "viewRequests";
    } 
    
    @PostMapping("/requests/approve")
    public String approveRequest(@RequestParam("requestId") int requestId, RedirectAttributes redirectAttributes) {
        supplierService.updateRequestStatus(requestId, "APPROVED");
        redirectAttributes.addFlashAttribute("message", "Request approved successfully.");
        return "redirect:/supplier/view-requests";
    }

    @PostMapping("/requests/reject")
    public String rejectRequest(@RequestParam("requestId") int requestId, RedirectAttributes redirectAttributes) {
        supplierService.updateRequestStatus(requestId, "REJECTED");
        redirectAttributes.addFlashAttribute("message", "Request rejected successfully.");
        return "redirect:/supplier/view-requests";
    }
}

