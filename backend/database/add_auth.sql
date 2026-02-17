-- Add authentication support
USE campus_db;

-- Add password field to users table
ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'password123';

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (username, password, name, email) 
VALUES ('admin', 'admin123', 'System Admin', 'admin@campus.com');
