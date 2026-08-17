-- FixMate Clean Database Script
-- Removes all dummy users, dummy providers (Rahul Sharma, Priya Mehta, Arjun Patel), dummy services, bookings, and reviews from MySQL
USE fixmate_db;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE review;
TRUNCATE TABLE maintenance_reminder;
TRUNCATE TABLE society_booking;
TRUNCATE TABLE booking;
TRUNCATE TABLE service;
TRUNCATE TABLE provider;
DELETE FROM users WHERE email != 'admin@fixmate.com';

SET FOREIGN_KEY_CHECKS = 1;
