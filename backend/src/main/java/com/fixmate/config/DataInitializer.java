package com.fixmate.config;

import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
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
        // Seed / Reset Admin Account with explicit password: AdminPassword@123
        userRepository.findByEmail("admin@fixmate.com").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("AdminPassword@123"));
                admin.setName("System Administrator");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println(">>> Updated Admin credentials: admin@fixmate.com / AdminPassword@123");
            },
            () -> {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@fixmate.com");
                admin.setPassword(passwordEncoder.encode("AdminPassword@123"));
                admin.setPhone("+91 9999999999");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println(">>> Created Admin user: admin@fixmate.com / AdminPassword@123");
            }
        );

        // Seed Services if none exist
        if (serviceRepository.count() == 0) {
            ServiceEntity electrician = new ServiceEntity();
            electrician.setServiceName("Master Electrical Repair & Wiring");
            electrician.setDescription("Complete home wiring check, short-circuit fixes, switchboard installation.");
            electrician.setPrice(new BigDecimal("499.00"));
            electrician.setCategory("Electrician");
            serviceRepository.save(electrician);

            ServiceEntity plumber = new ServiceEntity();
            plumber.setServiceName("Emergency Plumbing & Leakage Fix");
            plumber.setDescription("Urgent pipe leak repair, blockages clearance, tap replacement.");
            plumber.setPrice(new BigDecimal("399.00"));
            plumber.setCategory("Plumber");
            serviceRepository.save(plumber);

            ServiceEntity ac = new ServiceEntity();
            ac.setServiceName("AC Deep Cleaning & Gas Refill");
            ac.setDescription("Filter cleaning, cooling coil wash, gas level inspection and top-up.");
            ac.setPrice(new BigDecimal("899.00"));
            ac.setCategory("AC Repair");
            serviceRepository.save(ac);

            ServiceEntity cleaning = new ServiceEntity();
            cleaning.setServiceName("Deep Home Cleaning & Sanitization");
            cleaning.setDescription("Full apartment deep cleaning, floor scrubbing, bathroom sanitization.");
            cleaning.setPrice(new BigDecimal("1499.00"));
            cleaning.setCategory("Cleaning");
            serviceRepository.save(cleaning);

            System.out.println(">>> Seeded default services");
        }

        // Seed Provider if none exist
        if (providerRepository.count() == 0) {
            User pUser = userRepository.findByEmail("provider@fixmate.com").orElseGet(() -> {
                User u = new User();
                u.setName("Rahul Sharma");
                u.setEmail("provider@fixmate.com");
                u.setPassword(passwordEncoder.encode("ProviderPassword@123"));
                u.setPhone("+91 98200 11223");
                u.setRole("ROLE_PROVIDER");
                return userRepository.save(u);
            });

            Provider provider = new Provider();
            provider.setUser(pUser);
            provider.setExperience("8 Years");
            provider.setLocation("Andheri East, Mumbai");
            provider.setVerificationStatus("VERIFIED");
            provider.setTrustScore(95);
            provider.setIsAvailable(true);
            providerRepository.save(provider);

            System.out.println(">>> Seeded default verified provider: Rahul Sharma");
        }
    }
}
