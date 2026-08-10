package com.fixmate.config;

import com.fixmate.entity.Provider;
import com.fixmate.entity.User;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    }
}
