package com.csye6220.medshop.service;

import com.csye6220.medshop.dao.MedDao;
import com.csye6220.medshop.model.Med;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedService {

    @Autowired
    private MedDao medDao;

    public MedService() {
        medDao = new MedDao();
    }
    
    @Transactional
    public void persist(Med entity) {
        medDao.persist(entity);
    }
    
    @Transactional
    public void update(Med entity) {
        medDao.update(entity);
    }
      
    @Transactional
    public void addMed(Med med) {
        if (med.getId() == 0) {
            medDao.persist(med);
        } else { 
            medDao.update(med);
        }
    }

    @Transactional(readOnly = true)
    public Med findById(int id) {
        return medDao.findById(id);
    }

    @Transactional
    public void delete(int id) {
        Med med = medDao.findById(id);
        medDao.delete(med);
    }

    @Transactional(readOnly = true)
    public List<Med> findAll() {
        return medDao.findAll();
    }

    @Transactional
    public void deleteAll() {
        medDao.deleteAll();
    }

    @Transactional(readOnly = true)
    public List<Med> findLowStockMedications() {
        return medDao.findAll().stream()
                     .filter(med -> med.getStock() < 20)
                     .collect(Collectors.toList());
    }
}


