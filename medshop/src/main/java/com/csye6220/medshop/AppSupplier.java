package com.csye6220.medshop;
import com.csye6220.medshop.model.Supplier;
import com.csye6220.medshop.service.SupplierService;
import java.util.List;

public class AppSupplier {
    public static void main(String[] args) {
        SupplierService supplierService = new SupplierService();
        Supplier supplier1 = new Supplier("supplierA", "California");
        Supplier supplier2 = new Supplier("supplierB", "Boston");
        Supplier supplier3 = new Supplier("supplierC", "Florida");
                System.out.println("*** Persist - start ***");
        supplierService.persist(supplier1);
        supplierService.persist(supplier2);
        supplierService.persist(supplier3);
        List<Supplier> users1 = supplierService.findAll();
        System.out.println("Suppliers Persisted are :");
        for (Supplier b : users1) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** Persist - end ***");
        System.out.println("*** Update - start ***");
        supplier1.setName("Manas");
        supplierService.update(supplier1);
        System.out.println("Supplier Updated is =>" +supplierService.findById(supplier1.getId()).toString());
        System.out.println("*** Update - end ***");
        System.out.println("*** Find - start ***");
        Integer id1 = supplier1.getId();
        Supplier another = supplierService.findById(id1);
        System.out.println("Supplier found with id " + id1 + " is =>" + another.toString());
        System.out.println("*** Find - end ***");
        System.out.println("*** Delete - start ***");
        Integer id3 = supplier3.getId();
        supplierService.delete(id3);
        System.out.println("Deleted supplier with id " + id3 + ".");
        System.out.println("Now all suppliers are " + supplierService.findAll().size() + ".");
        System.out.println("*** Delete - end ***");
        System.out.println("*** FindAll - start ***");
        List<Supplier> supplier4 = supplierService.findAll();
        System.out.println("Suppliers found are :");
        for (Supplier b : supplier4) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** FindAll - end ***");
//        System.out.println("*** DeleteAll - start ***");
//        supplierService.deleteAll();
        System.out.println("Suppliers found are now " + supplierService.findAll().size());
        System.out.println("*** DeleteAll - end ***");
         System.exit(0);
    }
}