package com.fixmate.config;

import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.repository.ServiceRepository;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        if (!userRepository.existsByEmail("admin@fixmate.com")) {
            User admin = new User();
            admin.setName("Admin System");
            admin.setEmail("admin@fixmate.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setPhone("+91 9999999999");
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println(">>> Seeded default Admin user: admin@fixmate.com");
        }

        // Seed Customer User
        if (!userRepository.existsByEmail("customer@fixmate.com")) {
            User customer = new User();
            customer.setName("Sumit Shelar");
            customer.setEmail("customer@fixmate.com");
            customer.setPassword(passwordEncoder.encode("password123"));
            customer.setPhone("+91 9876543210");
            customer.setRole("ROLE_CUSTOMER");
            userRepository.save(customer);
            System.out.println(">>> Seeded default Customer user: customer@fixmate.com");
        }

        // Seed Provider User
        if (!userRepository.existsByEmail("rahul.provider@fixmate.com")) {
            User providerUser = new User();
            providerUser.setName("Rahul Sharma");
            providerUser.setEmail("rahul.provider@fixmate.com");
            providerUser.setPassword(passwordEncoder.encode("password123"));
            providerUser.setPhone("+91 9876543211");
            providerUser.setRole("ROLE_PROVIDER");
            User savedProviderUser = userRepository.save(providerUser);

            Provider provider = new Provider();
            provider.setUser(savedProviderUser);
            provider.setExperience("5 Years");
            provider.setLocation("Andheri East, Mumbai");
            provider.setVerificationStatus("VERIFIED");
            provider.setTrustScore(97);
            provider.setIsAvailable(true);
            providerRepository.save(provider);
            System.out.println(">>> Seeded default Provider user: rahul.provider@fixmate.com");
        }

        // Seed Services
        if (serviceRepository.count() == 0) {

            ServiceEntity electrician = new ServiceEntity();
            electrician.setServiceName("Master Electrical Repair & Wiring");
            electrician.setDescription(
                    "Complete home wiring check, short-circuit fixes, switchboard installation."
            );
            electrician.setPrice(new BigDecimal("499.00"));
            electrician.setCategory("Electrician");
            serviceRepository.save(electrician);

            ServiceEntity plumber = new ServiceEntity();
            plumber.setServiceName("Emergency Plumbing & Leakage Fix");
            plumber.setDescription(
                    "Urgent pipe leak repair, blockages clearance, tap replacement."
            );
            plumber.setPrice(new BigDecimal("399.00"));
            plumber.setCategory("Plumber");
            serviceRepository.save(plumber);

            ServiceEntity ac = new ServiceEntity();
            ac.setServiceName("AC Deep Cleaning & Gas Refill");
            ac.setDescription(
                    "Filter cleaning, cooling coil wash, gas level inspection and top-up."
            );
            ac.setPrice(new BigDecimal("899.00"));
            ac.setCategory("AC Repair");
            serviceRepository.save(ac);

            ServiceEntity cleaning = new ServiceEntity();
            cleaning.setServiceName("Deep Home Cleaning & Sanitization");
            cleaning.setDescription(
                    "Full apartment deep cleaning, floor scrubbing, bathroom sanitization."
            );
            cleaning.setPrice(new BigDecimal("1499.00"));
            cleaning.setCategory("Cleaning");
            serviceRepository.save(cleaning);

            System.out.println(">>> Seeded default services");
        }

    }
}
