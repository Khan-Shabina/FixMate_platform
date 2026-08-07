-- FixMate MySQL Database Seed Data
USE fixmate_db;

-- Seed Users (Passwords encrypted using BCrypt for 'password123')
INSERT INTO users (user_id, name, email, password, phone, role) VALUES
(1, 'Sumit Shelar', 'customer@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9876543210', 'ROLE_CUSTOMER'),
(2, 'Shabina Khan', 'shabina@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9876543211', 'ROLE_CUSTOMER'),
(3, 'Rahul Sharma', 'rahul.provider@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9820011223', 'ROLE_PROVIDER'),
(4, 'Priya Mehta', 'priya.provider@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9820044556', 'ROLE_PROVIDER'),
(5, 'Arjun Patel', 'arjun.provider@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9820077889', 'ROLE_PROVIDER'),
(6, 'Admin System', 'admin@fixmate.com', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHeFj9f8zN2z8Z3cO3u5K5h1X2Y3Z4A5B6', '+91 9000000000', 'ROLE_ADMIN');

-- Seed Providers
INSERT INTO provider (provider_id, user_id, experience, location, verification_status, trust_score, is_available) VALUES
(1, 3, '8 Years', 'Andheri East, Mumbai', 'VERIFIED', 97, TRUE),
(2, 4, '5 Years', 'Koramangala, Bangalore', 'VERIFIED', 95, TRUE),
(3, 5, '6 Years', 'Sector 22, Noida', 'PENDING', 91, FALSE);

-- Seed Services
INSERT INTO service (service_id, service_name, description, price, category) VALUES
(1, 'Master Electrical Repair & Wiring', 'Complete home wiring check, short-circuit fixes, switchboard installation.', 499.00, 'Electrician'),
(2, 'Emergency Plumbing & Leakage Fix', 'Urgent pipe leak repair, blockages clearance, tap replacement.', 399.00, 'Plumber'),
(3, 'AC Deep Cleaning & Gas Refill', 'Filter cleaning, cooling coil wash, gas level inspection and top-up.', 899.00, 'AC Repair'),
(4, 'Deep Home Cleaning & Sanitization', 'Full apartment deep cleaning, floor scrubbing, bathroom sanitization.', 1499.00, 'Cleaning'),
(5, 'RO Water Purifier Servicing', 'Filter replacement, TDS testing, membrane check.', 599.00, 'Appliance Repair'),
(6, 'Full Community Pest Control Treatment', 'Eco-friendly cockroach, bedbug, and termite treatment.', 1299.00, 'Pest Control');

-- Seed Bookings
INSERT INTO booking (booking_id, customer_id, provider_id, service_id, booking_date, status, emergency_flag, address) VALUES
(1, 1, 1, 1, '2026-08-10 10:00:00', 'ACCEPTED', FALSE, 'Flat 402, Green Valley Society, Andheri East'),
(2, 1, 2, 3, '2026-08-08 14:30:00', 'IN_PROGRESS', TRUE, 'Flat 402, Green Valley Society, Andheri East'),
(3, 2, 1, 2, '2026-08-05 11:00:00', 'COMPLETED', TRUE, 'B-12 Sunrise Heights, Powai');

-- Seed Reviews
INSERT INTO review (review_id, booking_id, rating, comment, date) VALUES
(1, 3, 5, 'Arrived in 15 minutes during midnight emergency! Excellent work fixing the pipe leak.', '2026-08-05 12:30:00');

-- Seed Maintenance Reminders
INSERT INTO maintenance_reminder (reminder_id, customer_id, service_id, reminder_date, status) VALUES
(1, 1, 3, '2026-08-15', 'PENDING'),
(2, 1, 5, '2026-08-30', 'PENDING'),
(3, 1, 6, '2026-07-20', 'OVERDUE');

-- Seed Society Bookings
INSERT INTO society_booking (society_booking_id, customer_id, service_id, members_count, booking_date, status, society_name, discount_percentage) VALUES
(1, 1, 6, 14, '2026-08-20', 'ACTIVE', 'Green Valley Society', 20),
(2, 2, 4, 8, '2026-08-25', 'ACTIVE', 'Sunrise Heights Apartments', 15);
