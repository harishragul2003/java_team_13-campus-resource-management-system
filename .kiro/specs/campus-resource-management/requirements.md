# Requirements Document

## Introduction

The Campus Resource Management System is a full-stack web application designed for a 5-6 hour hackathon sprint. The system enables users to manage campus resources (labs, classrooms, event halls) and handle bookings with validation to prevent double-booking conflicts. Built with React, Node.js/Express, and MySQL, the system focuses on CRUD operations, database integration, RESTful API design, and clean code practices.

## Glossary

- **System**: The Campus Resource Management System
- **User**: A person registered in the system with a role (STUDENT or STAFF)
- **Resource**: A campus facility that can be booked (LAB, CLASSROOM, or EVENT_HALL)
- **Booking**: A reservation of a resource by a user for a specific date and time slot
- **Time_Slot**: A specific time period during which a resource can be booked
- **Double_Booking**: An invalid state where a resource is booked by multiple users for the same date and time slot
- **Backend_API**: The Node.js/Express REST API server
- **Frontend_App**: The React-based user interface
- **Database**: The MySQL database storing all system data

## Requirements

### Requirement 1: User Management

**User Story:** As a system administrator, I want to manage user accounts, so that I can control who has access to the campus resource booking system.

#### Acceptance Criteria

1. WHEN a new user is created, THE System SHALL generate a unique auto-incrementing id
2. WHEN a user is created with an email, THE System SHALL validate that the email is unique across all users
3. WHEN creating or updating a user, THE System SHALL require name, email, phone, and role fields
4. WHEN a user role is set, THE System SHALL accept only STUDENT or STAFF values
5. WHEN a user status is set, THE System SHALL accept only ACTIVE or INACTIVE values
6. WHEN a user is created, THE System SHALL automatically set the createdAt timestamp
7. WHEN retrieving all users, THE System SHALL return the complete list of users with all fields
8. WHEN retrieving a user by id, THE System SHALL return that specific user's data or an error if not found
9. WHEN updating a user, THE System SHALL modify only the provided fields and preserve others
10. WHEN deleting a user, THE System SHALL remove the user record from the database
11. WHEN filtering users by status, THE System SHALL return only users matching the specified status

### Requirement 2: Resource Management

**User Story:** As a system administrator, I want to manage campus resources, so that I can maintain an accurate inventory of bookable facilities.

#### Acceptance Criteria

1. WHEN a new resource is created, THE System SHALL generate a unique auto-incrementing id
2. WHEN creating a resource, THE System SHALL require name, type, capacity, and status fields
3. WHEN a resource type is set, THE System SHALL accept only LAB, CLASSROOM, or EVENT_HALL values
4. WHEN a resource status is set, THE System SHALL accept only AVAILABLE or UNAVAILABLE values
5. WHEN a resource capacity is set, THE System SHALL validate that it is a positive integer
6. WHEN retrieving all resources, THE System SHALL return the complete list of resources with all fields
7. WHEN updating a resource, THE System SHALL modify only the provided fields and preserve others
8. WHEN deleting a resource, THE System SHALL remove the resource record from the database

### Requirement 3: Booking Management

**User Story:** As a user, I want to book campus resources for specific dates and time slots, so that I can reserve facilities for my activities.

#### Acceptance Criteria

1. WHEN a new booking is created, THE System SHALL generate a unique auto-incrementing id
2. WHEN creating a booking, THE System SHALL require userId, resourceId, bookingDate, and timeSlot fields
3. WHEN creating a booking, THE System SHALL validate that the userId references an existing user
4. WHEN creating a booking, THE System SHALL validate that the resourceId references an existing resource
5. WHEN a booking status is set, THE System SHALL accept only PENDING, APPROVED, or REJECTED values
6. WHEN a new booking is created, THE System SHALL default the status to PENDING
7. WHEN retrieving all bookings, THE System SHALL return the complete list of bookings with all fields
8. WHEN updating a booking status, THE System SHALL allow transitions between PENDING, APPROVED, and REJECTED
9. WHEN retrieving bookings by userId, THE System SHALL return all bookings for that specific user
10. WHEN retrieving bookings by resourceId, THE System SHALL return all bookings for that specific resource

### Requirement 4: Double-Booking Prevention

**User Story:** As a system administrator, I want to prevent double-booking of resources, so that conflicts and scheduling issues are avoided.

#### Acceptance Criteria

1. WHEN a booking is created for a resource, date, and time slot, THE System SHALL check if another booking exists for the same combination
2. IF a booking already exists for the same resource, date, and time slot, THEN THE System SHALL reject the new booking request
3. WHEN rejecting a double-booking attempt, THE System SHALL return a descriptive error message
4. WHEN a booking is approved, THE System SHALL ensure no other approved booking exists for the same resource, date, and time slot

### Requirement 5: RESTful API Design

**User Story:** As a frontend developer, I want well-designed REST APIs, so that I can easily integrate the backend with the frontend application.

#### Acceptance Criteria

1. THE Backend_API SHALL expose endpoints following REST conventions (GET, POST, PUT, DELETE)
2. WHEN an API request succeeds, THE Backend_API SHALL return appropriate HTTP status codes (200, 201)
3. WHEN an API request fails due to client error, THE Backend_API SHALL return 4xx status codes
4. WHEN an API request fails due to server error, THE Backend_API SHALL return 5xx status codes
5. WHEN an API returns data, THE Backend_API SHALL format responses as JSON
6. THE Backend_API SHALL organize routes into separate modules (userRoutes, resourceRoutes, bookingRoutes)
7. THE Backend_API SHALL organize business logic into separate controllers (userController, resourceController, bookingController)

### Requirement 6: Database Schema and Integrity

**User Story:** As a backend developer, I want a properly structured MySQL database, so that data integrity is maintained and relationships are enforced.

#### Acceptance Criteria

1. THE Database SHALL define a users table with columns: id, name, email, phone, role, status, createdAt
2. THE Database SHALL define a resources table with columns: id, name, type, capacity, status
3. THE Database SHALL define a bookings table with columns: id, userId, resourceId, bookingDate, timeSlot, status
4. THE Database SHALL enforce a unique constraint on the email column in the users table
5. THE Database SHALL define a foreign key constraint from bookings.userId to users.id
6. THE Database SHALL define a foreign key constraint from bookings.resourceId to resources.id
7. WHEN a foreign key constraint is violated, THE Database SHALL reject the operation and return an error

### Requirement 7: Error Handling

**User Story:** As a developer, I want comprehensive error handling, so that users receive clear feedback when operations fail.

#### Acceptance Criteria

1. WHEN a database operation fails, THE System SHALL catch the error and return a meaningful message
2. WHEN validation fails, THE System SHALL return specific details about which fields are invalid
3. WHEN a resource is not found, THE System SHALL return a 404 status with a descriptive message
4. WHEN a unique constraint is violated, THE System SHALL return a 409 status with a descriptive message
5. WHEN an internal server error occurs, THE System SHALL return a 500 status and log the error details

### Requirement 8: Frontend User Interface

**User Story:** As an end user, I want an intuitive web interface, so that I can easily manage users, resources, and bookings.

#### Acceptance Criteria

1. THE Frontend_App SHALL provide a Users page displaying all users in a table or list format
2. THE Frontend_App SHALL provide a Resources page displaying all resources in a table or list format
3. THE Frontend_App SHALL provide a Bookings page displaying all bookings in a table or list format
4. WHEN a user wants to create or edit a user, THE Frontend_App SHALL display a UserForm component
5. WHEN a user wants to create a booking, THE Frontend_App SHALL display a BookingForm component
6. WHEN a form is submitted, THE Frontend_App SHALL send the appropriate API request to the backend
7. WHEN an API request completes, THE Frontend_App SHALL update the UI to reflect the changes
8. WHEN an API request fails, THE Frontend_App SHALL display an error message to the user

### Requirement 9: Code Organization and Quality

**User Story:** As a developer, I want clean and well-organized code, so that the project is maintainable and easy to understand during the hackathon.

#### Acceptance Criteria

1. THE Backend_API SHALL organize configuration in a separate config directory
2. THE Backend_API SHALL separate database configuration into config/db.js
3. THE Backend_API SHALL define environment variables in a .env file
4. THE Frontend_App SHALL organize pages into a pages directory
5. THE Frontend_App SHALL organize reusable components into a components directory
6. THE System SHALL follow consistent naming conventions across all files and functions
7. THE System SHALL include meaningful variable and function names that describe their purpose

### Requirement 10: Version Control

**User Story:** As a team member, I want proper Git usage, so that we can track changes and collaborate effectively during the hackathon.

#### Acceptance Criteria

1. THE System SHALL be initialized as a Git repository
2. WHEN code changes are made, THE System SHALL commit changes with descriptive messages
3. THE System SHALL organize commits logically by feature or module
4. THE System SHALL include a .gitignore file to exclude node_modules and .env files
