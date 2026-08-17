package com.fixmate.config;

import com.fixmate.entity.User;
import com.fixmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Bootstrap initial System Administrator account if not already present
        userRepository.findByEmail("admin@fixmate.com").ifPresentOrElse(
            admin -> {
                logger.info("System Administrator account confirmed: admin@fixmate.com");
            },
            () -> {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@fixmate.com");
                admin.setPassword(passwordEncoder.encode("AdminPassword@123"));
                admin.setPhone("+91 9999999999");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                logger.info("Initial System Administrator created: admin@fixmate.com");
            }
        );
    }
}
