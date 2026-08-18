-- FixMate Database Seed Data
-- Keep clean for production/staging environments.
-- Application initializes entities dynamically through API registration.

INSERT INTO users (name, email, password, phone, role) VALUES ('Dummy User', 'dummy@example.com', 'password', '1234567890', 'ROLE_CUSTOMER');
INSERT INTO services (service_name, description, price, category) VALUES ('Dummy Service', 'Dummy description', 50.0, 'Plumbing');
