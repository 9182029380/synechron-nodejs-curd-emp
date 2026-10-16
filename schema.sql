-- Run this file once to create the database, the table and sample data.
-- Command:  mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
  id          INT AUTO_INCREMENT PRIMARY KEY,           -- 1
  first_name  VARCHAR(50)  NOT NULL,                    -- 2
  last_name   VARCHAR(50)  NOT NULL,                    -- 3
  email       VARCHAR(100) NOT NULL UNIQUE,             -- 4
  phone       VARCHAR(15),                              -- 5
  department  VARCHAR(50)  NOT NULL,                    -- 6
  designation VARCHAR(50)  NOT NULL,                    -- 7
  salary      DECIMAL(10,2) NOT NULL DEFAULT 0,         -- 8
  hire_date   DATE,                                     -- 9
  status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active'  -- 10
);

INSERT INTO employees (first_name, last_name, email, phone, department, designation, salary, hire_date, status)
VALUES
('Ravi',  'Kumar', 'ravi.kumar@example.com',  '9876543210', 'Engineering', 'Backend Developer', 65000.00, '2024-03-15', 'Active'),
('Anita', 'Reddy', 'anita.reddy@example.com', '9123456780', 'HR',          'HR Executive',      45000.00, '2023-07-01', 'Active');
