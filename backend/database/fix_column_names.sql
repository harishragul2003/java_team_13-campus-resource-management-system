-- Fix column names from snake_case to camelCase
USE campus_db;

-- Check if columns need to be renamed
-- If your database has resource_id and user_id, this will rename them

-- Rename columns in bookings table if they exist in snake_case
ALTER TABLE bookings 
  CHANGE COLUMN user_id userId INT NOT NULL,
  CHANGE COLUMN resource_id resourceId INT NOT NULL,
  CHANGE COLUMN booking_date bookingDate DATE NOT NULL,
  CHANGE COLUMN time_slot timeSlot VARCHAR(50) NOT NULL;

-- If the above fails, it means columns are already in camelCase
-- In that case, you might need to check the actual column names in your database
