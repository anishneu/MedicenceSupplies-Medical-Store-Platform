/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.csye6220.medshop.dao;

import com.csye6220.medshop.model.StockRequest;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StockRequestDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public void persist(StockRequest stockRequest) {
        getCurrentSession().save(stockRequest);
    }

    public void update(StockRequest stockRequest) {
        getCurrentSession().update(stockRequest);
    }

    public StockRequest findById(int id) {
        return (StockRequest) getCurrentSession().get(StockRequest.class, id);
    }

    public List<StockRequest> findAll() {
        return getCurrentSession().createQuery("from StockRequest").list();
    }

    public void delete(StockRequest stockRequest) {
        getCurrentSession().delete(stockRequest);
    }
}
