# FixMate Database Configuration & Documentation

## Overview
This directory contains the database definition scripts for the **FixMate Platform**:
- `schema.sql`: Contains the complete relational schema definitions for MySQL and compliant SQL databases.
- `data.sql`: Base seed configuration file (clean of dummy / mock data).

## Database Setup (MySQL)

1. **Create Database & Apply Schema**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Backend Configuration**:
   Update `backend/src/main/resources/application.properties` or provide environment variables:
   ```properties
   spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/fixmate_db}
   spring.datasource.username=${DB_USERNAME:root}
   spring.datasource.password=${DB_PASSWORD:your_password}
   ```

3. **Tables Included**:
   - `users`: Registered customers, providers, and administrators.
   - `provider`: Verified service professionals with location, experience, and dynamic trust scores.
   - `service`: Catalog of repair, cleaning, and maintenance services.
   - `booking`: Service bookings with emergency auto-dispatch flags.
   - `review`: Verified customer ratings and reviews.
   - `maintenance_reminder`: Proactive smart maintenance scheduling.
   - `society_booking`: Group booking discounts for residential societies.
