-- FixMate MySQL Database Schema
-- Database Name: fixmate_db

CREATE DATABASE IF NOT EXISTS fixmate_db;
USE fixmate_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_PROVIDER', 'ROLE_ADMIN')),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Provider Table
CREATE TABLE IF NOT EXISTS provider (
    provider_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    experience VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    trust_score INT DEFAULT 85,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Service Table
CREATE TABLE IF NOT EXISTS service (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- 4. Booking Table
CREATE TABLE IF NOT EXISTS booking (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    booking_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    emergency_flag BOOLEAN DEFAULT FALSE,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES provider(provider_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
);

-- 5. Review Table
CREATE TABLE IF NOT EXISTS review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

-- 6. Maintenance Reminder Table
CREATE TABLE IF NOT EXISTS maintenance_reminder (
    reminder_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    reminder_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'OVERDUE')),
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
);

-- 7. Society Booking Table
CREATE TABLE IF NOT EXISTS society_booking (
    society_booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    members_count INT DEFAULT 1,
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CONFIRMED', 'COMPLETED')),
    society_name VARCHAR(100) NOT NULL,
    discount_percentage INT DEFAULT 15,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
);
