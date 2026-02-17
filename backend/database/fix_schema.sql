-- Fix Campus Resource Management System Database Schema
-- This script drops and recreates tables with proper AUTO_INCREMENT

USE campus_db;

-- Drop tables in correct order (due to foreign keys)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  role ENUM('STUDENT', 'STAFF') NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('LAB', 'CLASSROOM', 'EVENT_HALL') NOT NULL,
  capacity INT NOT NULL,
  status ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE'
);

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  resourceId INT NOT NULL,
  bookingDate DATE NOT NULL,
  timeSlot VARCHAR(50) NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resourceId) REFERENCES resources(id) ON DELETE CASCADE
);
