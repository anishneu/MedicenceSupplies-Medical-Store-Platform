package com.csye6220.medshop;
import com.csye6220.medshop.model.Med;
import com.csye6220.medshop.service.MedService;
import java.util.List;

public class AppMed {
 
    public static void main(String[] args) {
        MedService medService = new MedService();
        Med med1 = new Med("Dolo", "general", 2.30, 2);
        Med med2 = new Med("Pan", "general", 2.30, 3);
        Med med3 = new Med("iodex", "general", 3.50, 4);
        System.out.println("*** Persist - start ***");
        medService.persist(med1);
        medService.persist(med2);
        medService.persist(med3);
        List<Med> meds1 = medService.findAll();
        System.out.println("Meds Persisted are :");
        for (Med b : meds1) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** Persist - end ***");
        System.out.println("*** Update - start ***");
        med1.setName("Crocin");
        medService.update(med1);
        System.out.println("Med Updated is =>" +medService.findById(med1.getId()).toString());
        System.out.println("*** Update - end ***");
        System.out.println("*** Find - start ***");
        Integer id1 = med1.getId();
        Med another = medService.findById(id1);
        System.out.println("Med found with id " + id1 + " is =>" + another.toString());
        System.out.println("*** Find - end ***");
        System.out.println("*** Delete - start ***");
        Integer id3 = med3.getId();
        medService.delete(id3);
        System.out.println("Deleted med with id " + id3 + ".");
        System.out.println("Now all meds are " + medService.findAll().size() + ".");
        System.out.println("*** Delete - end ***");
        System.out.println("*** FindAll - start ***");
        List<Med> meds2 = medService.findAll();
        System.out.println("Meds found are :");
        for (Med b : meds2) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** FindAll - end ***");
//        System.out.println("*** DeleteAll - start ***");
//        medService.deleteAll();
        System.out.println("Meds found are now " + medService.findAll().size());
        System.out.println("*** DeleteAll - end ***");
         System.exit(0);
    }
}