package com.csye6220.medshop.dao;

import com.csye6220.medshop.model.Supplier;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupplierDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public void persist(Supplier entity) {
        getCurrentSession().save(entity);
    }

    public void update(Supplier entity) {
        getCurrentSession().update(entity);
    }

    public Supplier findById(int id) {
        return (Supplier) getCurrentSession().get(Supplier.class, id);
    }

    public void delete(Supplier entity) {
        getCurrentSession().delete(entity);
    }

    @SuppressWarnings("unchecked")
    public List<Supplier> findAll() {
        return getCurrentSession().createQuery("from Supplier").list();
    }

    public void deleteAll() {
        List<Supplier> entityList = findAll();
        for (Supplier entity : entityList) {
            delete(entity);
        }
    }
}

