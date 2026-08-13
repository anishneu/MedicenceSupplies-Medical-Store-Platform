package com.csye6220.medshop.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
@Entity
@Table(name = "orders")
public class Order implements Serializable {    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;
    
    @Column(name = "user_id")
    private int userId;
    
    @Column(name = "quantity")
    private int quantity;
        
    @Column(name = "order_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date orderDate;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "medication_id")
    private int medicationId;
    
    public Order() {}

    public Order(int id, int userId, int medicationId, int quantity, Date orderDate, String status) {
        this.id = id;
        this.userId = userId;
        this.medicationId = medicationId;
        this.quantity = quantity;
        this.orderDate = orderDate;
        this.status = status;
    }
    public Order(int userId, int medicationId, int quantity, Date orderDate, String status) {
        this.userId = userId;
        this.medicationId = medicationId;
        this.quantity = quantity;
        this.orderDate = orderDate;
        this.status = status;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(int medicationId) {
        this.medicationId = medicationId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    } 
    
    @Override
    public String toString() {
        return "Order: " + this.userId + ", " + this.medicationId + 
                this.quantity + this.orderDate + this.status;
    }
}


