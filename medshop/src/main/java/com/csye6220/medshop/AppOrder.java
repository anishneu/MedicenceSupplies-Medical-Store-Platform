package com.csye6220.medshop;
import com.csye6220.medshop.model.Order;
import com.csye6220.medshop.service.OrderService;
import java.util.Date;
import java.util.List;

public class AppOrder {
 
    public static void main(String[] args) {
        OrderService orderService = new OrderService();
       // (int medicationId, int quantity, Date orderDate, String status)
        Order order1 = new Order(1,1,1,new Date(),"general");
        Order order2 = new Order(2,1,1,new Date(),"general");
        Order order3 = new Order(3,1,1,new Date(),"general");
           
        System.out.println("*** Persist - start ***");
        orderService.persist(order1);
        orderService.persist(order2);
        orderService.persist(order3);
        List<Order> orders1 = orderService.findAll();
        System.out.println("Orders Persisted are :");
        for (Order b : orders1) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** Persist - end ***");
        System.out.println("*** Update - start ***");
        orderService.update(order1);
        System.out.println("Order Updated is =>" +orderService.findById(order1.getId()).toString());
        System.out.println("*** Update - end ***");
        System.out.println("*** Find - start ***");
        Integer id1 = order1.getId();
        Order another = orderService.findById(id1);
        System.out.println("Order found with id " + id1 + " is =>" + another.toString());
        System.out.println("*** Find - end ***");
        System.out.println("*** Delete - start ***");
        Integer id3 = order3.getId();
        orderService.delete(id3);
        System.out.println("Deleted order with id " + id3 + ".");
        System.out.println("Now all orders are " + orderService.findAll().size() + ".");
        System.out.println("*** Delete - end ***");
        System.out.println("*** FindAll - start ***");
        List<Order> order5 = orderService.findAll();
        System.out.println("Orders found are :");
        for (Order b : order5) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** FindAll - end ***");
        System.out.println("*** DeleteAll - start ***");
      //  orderService.deleteAll();
        System.out.println("Orders found are now " + orderService.findAll().size());
        System.out.println("*** DeleteAll - end ***");
         System.exit(0);
    }
}