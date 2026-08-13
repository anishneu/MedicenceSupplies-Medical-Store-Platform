package com.csye6220.medshop.service;

import com.csye6220.medshop.dao.OrderDao;
import com.csye6220.medshop.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderDao orderDao;

    public void persist(Order entity) {
        orderDao.persist(entity);
    }

    public List<Order> findAll() {
        return orderDao.findAll();
    }

    public void update(Order entity) {
        orderDao.update(entity);
    }

    public Order findById(int id) {
        return orderDao.findById(id);
    }

    public void delete(int id) {
        Order order = orderDao.findById(id);
        orderDao.delete(order);
    }

    public void placeOrder(Order order) {
        orderDao.persist(order);
    }

    public List<Order> getOrdersByUserId(int userId) {
        return orderDao.getOrdersByUserId(userId);
    }

    public void processOrder(int orderId) {
        orderDao.updateOrderStatus(orderId, "Processed");
    }

    public void deleteAll() {
        List<Order> orders = orderDao.findAll();
        for (Order order : orders) {
            orderDao.delete(order);
        }
    }
    
    public List<Order> getAll() {
        List<Order> orders = orderDao.findAll();
        return orders;
    }
    
     public List<Order> getAllOrders() {
        return orderDao.findAll();
    }
}




