package com.csye6220.medshop.service;

import com.csye6220.medshop.dao.MedDao;
import com.csye6220.medshop.dao.StockRequestDao;
import com.csye6220.medshop.dao.SupplierDao;
import com.csye6220.medshop.model.Med;
import com.csye6220.medshop.model.StockRequest;
import com.csye6220.medshop.model.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private MedDao medDao;

    @Autowired
    private SupplierDao supplierDAO;

    @Autowired
    private StockRequestDao stockRequestDao;
    
    @Transactional
    public void persist(Supplier entity) {
        supplierDAO.persist(entity);
    }
    
    @Transactional
    public void update(Supplier entity) {
        supplierDAO.update(entity);
    }
    
    @Transactional
    public List<Supplier> findAll() {
        List<Supplier> listSupplier = supplierDAO.findAll();
        return listSupplier;
    }
   
    public List<Med> getLowStockMedications() {
        return medDao.findAll().stream()
                .filter(med -> med.getStock() < 10)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMedicationStock(int medId, int newStock) {
        Med med = medDao.findById(medId);
        if (med != null) {
            med.setStock(newStock);
            medDao.update(med);
        }
    }

    @Transactional(readOnly = true)
    public List<Supplier> getAllSuppliers() {
        return supplierDAO.findAll();
    }

    @Transactional
    public void addSupplier(Supplier supplier) {
        supplierDAO.persist(supplier);
    }

    @Transactional(readOnly = true)
    public Supplier findById(int id) {
        return supplierDAO.findById(id);
    }

    @Transactional
    public void delete(int id) {
        Supplier supplier = supplierDAO.findById(id);
        if (supplier != null) {
            supplierDAO.delete(supplier);
        }
    }
    
    @Transactional(readOnly = true)
    public List<StockRequest> getAllRequests() {
        return stockRequestDao.findAll();
    }
    
    @Transactional
    public void updateRequestStatus(int requestId, String status) {
        StockRequest request = stockRequestDao.findById(requestId);
        if (request != null) {
            request.setStatus(status);
            int medId = request.getMedId();
            int reqStock = request.getRequestedQuantity();
            
            // If status is APPROVED, update associated Medication stock
            if ("APPROVED".equals(status) &&
                    (medId > 0) &&
                    (reqStock > 0)
                )
            {
                // Update changes to Medication table
                Med med = medDao.findById(request.getMedId());
                int newStock = med.getStock() + reqStock ;
                if (newStock >  med.getStock()) {
                    med.setId(request.getMedId());
                    med.setStock(newStock);
                    medDao.update(med);
                }
            }
            
            // Persist changes to both StockRequest
            stockRequestDao.persist(request);
        } else {
            throw new IllegalArgumentException("Request not found with ID: " + requestId);
        }
    }
}


