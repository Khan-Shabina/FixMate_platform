package com.fixmate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FixMateApplication {

    private static final Logger logger = LoggerFactory.getLogger(FixMateApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(FixMateApplication.class, args);
        logger.info("FixMate Spring Boot Backend is running.");
    }
}
