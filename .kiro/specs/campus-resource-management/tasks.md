# Implementation Plan: Campus Resource Management System

## Overview

This implementation plan breaks down the Campus Resource Management System into discrete coding tasks suitable for a 5-6 hour hackathon sprint. The plan follows a bottom-up approach: database setup → backend API → frontend UI → integration. Each task builds incrementally to ensure working functionality at each checkpoint.

## Tasks

- [-] 1. Initialize project structure and dependencies
  - Create backend directory with package.json (express, mysql2, dotenv, cors, nodemon)
  - Create frontend directory using Create React App
  - Set up .gitignore files for both frontend and backend
  - Initialize Git repository with initial commit
  - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.4_

- [ ] 2. Set up MySQL database and connection
  - [ ] 2.1 Create database schema with SQL script
    - Write SQL CREATE TABLE statements for users, resources, and bookings tables
    - Include all constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, ENUM, DEFAULT)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 2.2 Implement database connection configuration
    - Create backend/config/db.js with MySQL connection pool
    - Create .env file with database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT)
    - Test connection on server startup
    - _Requirements: 9.2, 9.3_

- [ ] 3. Implement User Management backend
  - [ ] 3.1 Create user routes and controller structure
    - Create backend/routes/userRoutes.js with route definitions
    - Create backend/controllers/userController.js with function stubs
    - Wire routes to controller functions
    - _Requirements: 5.6, 5.7, 9.1_
  
  - [ ] 3.2 Implement createUser controller function
    - Extract and validate request body fields (name, email, phone, role, status)
    - Execute INSERT query with parameterized values
    - Handle unique constraint violation (duplicate email) with 409 status
    - Return 201 with created user or appropriate error status
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 7.4_
  
  - [ ]* 3.3 Write property test for user email uniqueness
    - **Property 1: User email uniqueness**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.4 Write property test for user creation completeness
    - **Property 2: User creation completeness**
    - **Validates: Requirements 1.1, 1.3, 1.6**
  
  - [ ] 3.5 Implement getAllUsers and getUserById controller functions
    - Implement getAllUsers with optional status query parameter filtering
    - Implement getUserById with 404 handling for non-existent users
    - Return 200 with data or appropriate error status
    - _Requirements: 1.7, 1.8, 1.11, 7.3_
  
  - [ ]* 3.6 Write property test for user status filtering
    - **Property 8: User status filtering**
    - **Validates: Requirements 1.11**
  
  - [ ] 3.7 Implement updateUser and deleteUser controller functions
    - Implement updateUser with partial field updates
    - Implement deleteUser with 404 handling
    - Return appropriate status codes
    - _Requirements: 1.9, 1.10_
  
  - [ ]* 3.8 Write unit tests for user management edge cases
    - Test creating user with duplicate email returns 409
    - Test getting non-existent user returns 404
    - Test deleting non-existent user returns 404
    - _Requirements: 1.2, 1.8, 1.10_

- [ ] 4. Implement Resource Management backend
  - [ ] 4.1 Create resource routes and controller
    - Create backend/routes/resourceRoutes.js with route definitions
    - Create backend/controllers/resourceController.js with function implementations
    - Wire routes to controller functions
    - _Requirements: 5.6, 5.7_
  
  - [ ] 4.2 Implement all resource CRUD operations
    - Implement createResource with validation (capacity > 0, valid type/status enums)
    - Implement getAllResources
    - Implement updateResource with 404 handling
    - Implement deleteResource with 404 handling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  
  - [ ]* 4.3 Write property tests for resource constraints
    - **Property 10: Resource type constraint**
    - **Property 11: Resource status constraint**
    - **Property 12: Resource capacity validation**
    - **Validates: Requirements 2.3, 2.4, 2.5**

- [ ] 5. Implement Booking Management backend with double-booking prevention
  - [ ] 5.1 Create booking routes and controller structure
    - Create backend/routes/bookingRoutes.js with all route definitions
    - Create backend/controllers/bookingController.js with function stubs
    - Wire routes to controller functions
    - _Requirements: 5.6, 5.7_
  
  - [ ] 5.2 Implement createBooking with double-booking validation
    - Extract and validate request body (userId, resourceId, bookingDate, timeSlot)
    - Query database for existing booking with same resourceId, bookingDate, timeSlot
    - If exists, return 409 with "Resource already booked" error message
    - Validate foreign keys (userId and resourceId exist)
    - Execute INSERT with default status PENDING
    - Return 201 with created booking or appropriate error
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 4.1, 4.2, 4.3, 7.4_
  
  - [ ]* 5.3 Write property test for double-booking prevention
    - **Property 17: Double-booking prevention**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 5.4 Write property tests for booking foreign key integrity
    - **Property 13: Booking foreign key integrity (userId)**
    - **Property 14: Booking foreign key integrity (resourceId)**
    - **Validates: Requirements 3.3, 3.4**
  
  - [ ] 5.5 Implement remaining booking operations
    - Implement getAllBookings with JOIN to include user and resource details
    - Implement updateBookingStatus with status validation
    - Implement getBookingsByUser
    - Implement getBookingsByResource
    - _Requirements: 3.7, 3.8, 3.9, 3.10_
  
  - [ ]* 5.6 Write unit tests for booking operations
    - Test creating booking with non-existent userId returns 400
    - Test creating booking with non-existent resourceId returns 400
    - Test creating duplicate booking returns 409
    - _Requirements: 3.3, 3.4, 4.1_

- [ ] 6. Set up Express server and middleware
  - Create backend/server.js with Express app initialization
  - Configure middleware (express.json(), cors())
  - Register all route modules (/api/users, /api/resources, /api/bookings)
  - Add global error handling middleware
  - Start server on port from .env (default 5000)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.5_

- [ ] 7. Checkpoint - Test all backend APIs
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test all endpoints using Postman or curl
  - Verify double-booking prevention works correctly
  - Verify foreign key constraints are enforced
  - Verify error responses have correct status codes and messages

- [ ] 8. Implement React frontend structure and routing
  - [ ] 8.1 Set up React Router and navigation
    - Install react-router-dom and axios
    - Create App.js with BrowserRouter and Routes
    - Define routes: /users, /resources, /bookings
    - Add navigation menu/header component
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 8.2 Create page component files
    - Create src/pages/Users.js with basic structure
    - Create src/pages/Resources.js with basic structure
    - Create src/pages/Bookings.js with basic structure
    - _Requirements: 9.4_

- [ ] 9. Implement Users page and UserForm component
  - [ ] 9.1 Implement Users.js page
    - Add state for users array, loading, error
    - Fetch users from GET /api/users on component mount
    - Display users in table with columns: name, email, phone, role, status
    - Add "Add User" button to toggle form visibility
    - Add Edit and Delete buttons for each user row
    - Implement delete functionality with confirmation
    - _Requirements: 8.1, 8.4, 8.6, 8.7, 8.8_
  
  - [ ] 9.2 Create UserForm.js component
    - Add form fields: name, email, phone, role (dropdown), status (dropdown)
    - Implement form validation (all fields required, email format)
    - Handle form submission (POST for create, PUT for update)
    - Display validation errors and API errors
    - Add Cancel button to close form
    - _Requirements: 8.4, 8.6, 8.8_

- [ ] 10. Implement Resources page
  - [ ] 10.1 Implement Resources.js page with CRUD operations
    - Add state for resources array, loading, error, form visibility
    - Fetch resources from GET /api/resources on mount
    - Display resources in table: name, type, capacity, status
    - Implement inline form or modal for create/edit
    - Add form fields: name, type (dropdown), capacity (number), status (dropdown)
    - Implement create (POST) and update (PUT) operations
    - Implement delete with confirmation
    - _Requirements: 8.2, 8.6, 8.7, 8.8_

- [ ] 11. Implement Bookings page and BookingForm component
  - [ ] 11.1 Implement Bookings.js page
    - Add state for bookings array, loading, error
    - Fetch bookings from GET /api/bookings on mount
    - Display bookings in table: user name, resource name, date, time slot, status
    - Add "Create Booking" button to toggle BookingForm
    - Add status update buttons (Approve/Reject) for PENDING bookings
    - Implement status update functionality (PUT /api/bookings/:id)
    - _Requirements: 8.3, 8.6, 8.7, 8.8_
  
  - [ ] 11.2 Create BookingForm.js component
    - Fetch users and resources for dropdown options on mount
    - Add form fields: userId (dropdown), resourceId (dropdown), bookingDate (date input), timeSlot (text input)
    - Implement form validation (all fields required)
    - Handle form submission (POST /api/bookings)
    - Handle and display double-booking error (409 status)
    - Add Cancel button
    - _Requirements: 8.5, 8.6, 8.8_

- [ ] 12. Final integration and testing
  - [ ] 12.1 Test complete user workflows
    - Test creating, viewing, updating, and deleting users
    - Test creating, viewing, updating, and deleting resources
    - Test creating bookings and verifying double-booking prevention
    - Test updating booking status
    - Verify all error messages display correctly
    - _Requirements: 1.1-1.11, 2.1-2.8, 3.1-3.10, 4.1-4.4_
  
  - [ ] 12.2 Add error handling and loading states
    - Ensure all API calls have try-catch error handling
    - Add loading spinners during API requests
    - Display user-friendly error messages
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.8_
  
  - [ ] 12.3 Code cleanup and documentation
    - Add comments to complex logic sections
    - Ensure consistent naming conventions
    - Remove console.logs and debug code
    - Create README.md with setup instructions
    - _Requirements: 9.6, 9.7_

- [ ] 13. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all CRUD operations work end-to-end
  - Verify double-booking prevention works in UI
  - Verify error handling works correctly
  - Test with multiple users and concurrent bookings
  - Prepare for demo presentation

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP delivery
- Focus on core functionality first (tasks 1-7) to ensure backend is solid
- Frontend tasks (8-11) can be developed in parallel once backend is complete
- Double-booking prevention (task 5.2) is the most critical business logic - test thoroughly
- Each checkpoint ensures incremental validation before moving forward
- Property tests should use fast-check library with minimum 100 iterations
- All property tests must include comment tags referencing design properties
