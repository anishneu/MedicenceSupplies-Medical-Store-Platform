package com.csye6220.medshop.dao;

import com.csye6220.medshop.model.Order;
import java.util.List;
import org.springframework.stereotype.Repository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;


@Repository
public class OrderDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    public void persist(Order entity) {
        getSession().save(entity);
    }

    public void update(Order entity) {
        getSession().update(entity);
    }

    public Order findById(int id) {
        return (Order) getSession().get(Order.class, id);
    }

    public void delete(Order entity) {
        getSession().delete(entity);
    }

    @SuppressWarnings("unchecked")
    public List<Order> findAll() {
        return getSession().createQuery("from Order").list();
    }

    public List<Order> getOrdersByUserId(int userId) {
        return getSession()
                .createQuery("from Order where userId = :userId")
                .setParameter("userId", userId)
                .list();
    }

    public void updateOrderStatus(int orderId, String status) {
        String hql = "UPDATE Order o SET o.status = :status WHERE o.id = :orderId";
        int rowsUpdated = getSession()
                .createQuery(hql)
                .setParameter("status", status)
                .setParameter("orderId", orderId)
                .executeUpdate();
        if (rowsUpdated == 0) {
            throw new IllegalArgumentException("Order with ID " + orderId + " not found");
        }
    }
}




