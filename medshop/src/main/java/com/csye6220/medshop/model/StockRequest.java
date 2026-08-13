/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.csye6220.medshop.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "stock_requests")
public class StockRequest implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "med_id")
    private int medId;

    @Column(name = "requested_quantity")
    private int requestedQuantity;

    @Column(name = "status")
    private String status; // "PENDING", "APPROVED", "REJECTED"

    public StockRequest() {}

    public StockRequest(int medId, int requestedQuantity, String status) {
        this.medId = medId;
        this.requestedQuantity = requestedQuantity;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getMedId() { return medId; }
    public void setMedId(int medId) { this.medId = medId; }

    public int getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(int requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
