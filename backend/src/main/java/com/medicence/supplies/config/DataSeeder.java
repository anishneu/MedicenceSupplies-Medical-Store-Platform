package com.medicence.supplies.config;

import com.medicence.supplies.domain.Medication;
import com.medicence.supplies.domain.Order;
import com.medicence.supplies.domain.OrderItem;
import com.medicence.supplies.domain.Role;
import com.medicence.supplies.domain.Supplier;
import com.medicence.supplies.domain.User;
import com.medicence.supplies.repository.MedicationRepository;
import com.medicence.supplies.repository.OrderRepository;
import com.medicence.supplies.repository.SupplierRepository;
import com.medicence.supplies.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            SupplierRepository supplierRepository,
            MedicationRepository medicationRepository,
            OrderRepository orderRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                refreshLocalImages(medicationRepository);
                return;
            }

            User admin = new User("admin", passwordEncoder.encode("password123"), Role.ADMIN);
            admin.setFullName("Alex Morgan");
            admin.setEmail("admin@medicence.example");
            admin.setPhone("+1 (617) 555-0100");
            admin.setAddress("100 Harbor Way, Boston, MA");
            userRepository.save(admin);

            User customer = new User("customer", passwordEncoder.encode("password123"), Role.CUSTOMER);
            customer.setFullName("Jordan Lee");
            customer.setEmail("jordan@example.com");
            customer.setPhone("+1 (617) 555-0142");
            customer.setAddress("42 Beacon St, Boston, MA");
            userRepository.save(customer);

            User supplierUser = new User("supplier", passwordEncoder.encode("password123"), Role.SUPPLIER);
            supplierUser.setFullName("Sam Rivera");
            supplierUser.setEmail("supply@medisource.example");
            supplierUser.setPhone("+1 (312) 555-0199");
            supplierUser.setAddress("880 Logistics Park, Chicago, IL");
            userRepository.save(supplierUser);

            supplierRepository.save(new Supplier("MediSource Wholesale", "supply@medisource.example", supplierUser));

            Medication amox = medicationRepository.save(new Medication(
                    "Amoxicillin 500mg", "Antibiotic", new BigDecimal("12.99"), 40,
                    "Broad-spectrum antibiotic capsules for bacterial infections. Pack of 21.",
                    "/products/amoxicillin.png", true));
            Medication ibu = medicationRepository.save(new Medication(
                    "Ibuprofen 200mg", "Pain Relief", new BigDecimal("6.49"), 15,
                    "Fast-acting anti-inflammatory tablets for pain and fever. Bottle of 100.",
                    "/products/ibuprofen.png", true));
            medicationRepository.save(new Medication(
                    "Loratadine 10mg", "Allergy", new BigDecimal("9.99"), 8,
                    "Non-drowsy daily allergy relief. 30 tablets.",
                    "/products/loratadine.png", false));
            Medication vit = medicationRepository.save(new Medication(
                    "Vitamin D3 5000 IU", "Supplement", new BigDecimal("14.50"), 60,
                    "Supports bone health and immune function. Softgels, 90 count.",
                    "/products/vitamin-d3.png", true));
            medicationRepository.save(new Medication(
                    "Omeprazole 20mg", "Digestive", new BigDecimal("11.25"), 32,
                    "Acid reducer for heartburn and GERD relief. 42 capsules.",
                    "/products/omeprazole.png", false));
            Medication oxi = medicationRepository.save(new Medication(
                    "Digital Pulse Oximeter", "Devices", new BigDecimal("29.99"), 22,
                    "Fingertip SpO2 and pulse rate monitor with OLED display.",
                    "/products/oximeter.png", true));
            Medication masks = medicationRepository.save(new Medication(
                    "Surgical Face Masks (50)", "PPE", new BigDecimal("8.99"), 120,
                    "3-ply disposable medical masks. Box of 50.",
                    "/products/masks.png", false));
            medicationRepository.save(new Medication(
                    "Hand Sanitizer 500ml", "Hygiene", new BigDecimal("5.49"), 75,
                    "70% alcohol gel sanitizer for clinical and home use.",
                    "/products/sanitizer.png", false));

            Order order1 = new Order();
            order1.setUser(customer);
            order1.addItem(new OrderItem(ibu, 5, ibu.getPrice()));
            order1.addItem(new OrderItem(masks, 3, masks.getPrice()));
            orderRepository.save(order1);

            Order order2 = new Order();
            order2.setUser(customer);
            order2.addItem(new OrderItem(amox, 2, amox.getPrice()));
            order2.addItem(new OrderItem(ibu, 4, ibu.getPrice()));
            order2.addItem(new OrderItem(vit, 1, vit.getPrice()));
            orderRepository.save(order2);

            Order order3 = new Order();
            order3.setUser(customer);
            order3.addItem(new OrderItem(oxi, 2, oxi.getPrice()));
            order3.addItem(new OrderItem(ibu, 2, ibu.getPrice()));
            orderRepository.save(order3);
        };
    }

    private void refreshLocalImages(MedicationRepository medicationRepository) {
        for (Medication med : medicationRepository.findAll()) {
            String mapped = mapImage(med.getName());
            if (mapped != null) {
                med.setImageUrl(mapped);
            }
            String n = med.getName() == null ? "" : med.getName().toLowerCase();
            if (n.contains("amoxicillin") || n.contains("ibuprofen") || n.contains("vitamin") || n.contains("oximeter")) {
                med.setFeatured(true);
            }
            medicationRepository.save(med);
        }
    }

    private String mapImage(String name) {
        if (name == null) return "/products/placeholder.svg";
        String n = name.toLowerCase();
        if (n.contains("amoxicillin")) return "/products/amoxicillin.png";
        if (n.contains("ibuprofen")) return "/products/ibuprofen.png";
        if (n.contains("loratadine")) return "/products/loratadine.png";
        if (n.contains("vitamin")) return "/products/vitamin-d3.png";
        if (n.contains("omeprazole")) return "/products/omeprazole.png";
        if (n.contains("oximeter")) return "/products/oximeter.png";
        if (n.contains("mask")) return "/products/masks.png";
        if (n.contains("sanitizer")) return "/products/sanitizer.png";
        return "/products/placeholder.svg";
    }
}
