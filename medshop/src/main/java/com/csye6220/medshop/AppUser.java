package com.csye6220.medshop;
import com.csye6220.medshop.model.User;
import com.csye6220.medshop.service.UserService;
import java.util.List;

public class AppUser {
    public enum Role { ADMIN, CUSTOMER, SUPPLIER };
    public static void main(String[] args) {
        UserService userService = new UserService();
        User user1 = new User("akuila", "akuila123", "ADMIN");
        User user2 = new User("skuila", "skuila123", "CUSTOMER");
        User user3 = new User("rkuila", "rkuila123", "SUPPLIER");
        System.out.println("*** Persist - start ***");
        userService.persist(user1);
        userService.persist(user2);
        userService.persist(user3);
        List<User> users1 = userService.findAll();
        System.out.println("Users Persisted are :");
        for (User b : users1) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** Persist - end ***");
        System.out.println("*** Update - start ***");
        user1.setUsername("Manas");
        userService.update(user1);
        System.out.println("User Updated is =>" +userService.findById(user1.getId()).toString());
        System.out.println("*** Update - end ***");
        System.out.println("*** Find - start ***");
        Integer id1 = user1.getId();
        User another = userService.findById(id1);
        System.out.println("User found with id " + id1 + " is =>" + another.toString());
        System.out.println("*** Find - end ***");
        System.out.println("*** Delete - start ***");
        Integer id3 = user3.getId();
//        userService.delete(id3);
        System.out.println("Deleted user with id " + id3 + ".");
        System.out.println("Now all users are " + userService.findAll().size() + ".");
        System.out.println("*** Delete - end ***");
        System.out.println("*** FindAll - start ***");
        List<User> meds2 = userService.findAll();
        System.out.println("Users found are :");
        for (User b : meds2) {
            System.out.println("-" + b.toString());
        }
        System.out.println("*** FindAll - end ***");
//        System.out.println("*** DeleteAll - start ***");
//        userService.deleteAll();
        System.out.println("Users found are now " + userService.findAll().size());
        System.out.println("*** DeleteAll - end ***");
         System.exit(0);
    }
}