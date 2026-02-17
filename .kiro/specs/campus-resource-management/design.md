# Design Document: Campus Resource Management System

## Overview

The Campus Resource Management System is a full-stack web application built for a hackathon environment (5-6 hour sprint). The architecture follows a three-tier pattern: React frontend, Node.js/Express REST API backend, and MySQL database. The system implements CRUD operations for three core entities (Users, Resources, Bookings) with critical business logic to prevent double-booking conflicts.

The design prioritizes simplicity, speed of development, and clean code organization suitable for a time-constrained hackathon setting.

## Architecture

### High-Level Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Port 3000)       │
└──────────┬──────────┘
           │ HTTP/REST
           │
┌──────────▼──────────┐
│  Express Backend    │
│   (Port 5000)       │
└──────────┬──────────┘
           │ SQL
           │
┌──────────▼──────────┐
│   MySQL Database    │
└─────────────────────┘
```

### Technology Stack

- **Frontend**: React 18+, Axios for HTTP requests, React Router for navigation
- **Backend**: Node.js, Express.js, MySQL2 driver, dotenv for configuration
- **Database**: MySQL 8.0+
- **Development**: Nodemon for backend hot-reload, Create React App for frontend

### Project Structure

**Backend:**
```
backend/
├── config/
│   └── db.js              # MySQL connection configuration
├── routes/
│   ├── userRoutes.js      # User endpoint definitions
│   ├── resourceRoutes.js  # Resource endpoint definitions
│   └── bookingRoutes.js   # Booking endpoint definitions
├── controllers/
│   ├── userController.js      # User business logic
│   ├── resourceController.js  # Resource business logic
│   └── bookingController.js   # Booking business logic
├── server.js              # Express app entry point
├── .env                   # Environment variables
└── package.json
```

**Frontend:**
```
frontend/src/
├── pages/
│   ├── Users.js       # User management page
│   ├── Resources.js   # Resource management page
│   └── Bookings.js    # Booking management page
├── components/
│   ├── UserForm.js    # User create/edit form
│   └── BookingForm.js # Booking creation form
├── App.js             # Main app component with routing
└── index.js           # React entry point
```

## Components and Interfaces

### Database Schema

**users table:**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  role ENUM('STUDENT', 'STAFF') NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**resources table:**
```sql
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('LAB', 'CLASSROOM', 'EVENT_HALL') NOT NULL,
  capacity INT NOT NULL,
  status ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE'
);
```

**bookings table:**
```sql
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
```

### Backend API Endpoints

**User Routes (userRoutes.js):**
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users (with optional status filter)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Resource Routes (resourceRoutes.js):**
- `POST /api/resources` - Create new resource
- `GET /api/resources` - Get all resources
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

**Booking Routes (bookingRoutes.js):**
- `POST /api/bookings` - Create new booking (with double-booking validation)
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/user/:userId` - Get bookings by user
- `GET /api/bookings/resource/:resourceId` - Get bookings by resource

### Backend Controllers

**userController.js:**
```javascript
// Pseudo-interface
createUser(req, res):
  - Extract name, email, phone, role, status from req.body
  - Validate required fields
  - Execute INSERT query
  - Return 201 with created user or 400/500 on error

getAllUsers(req, res):
  - Extract optional status filter from query params
  - Execute SELECT query with optional WHERE clause
  - Return 200 with user array

getUserById(req, res):
  - Extract id from req.params
  - Execute SELECT query with WHERE id = ?
  - Return 200 with user or 404 if not found

updateUser(req, res):
  - Extract id from req.params and fields from req.body
  - Execute UPDATE query
  - Return 200 with updated user or 404 if not found

deleteUser(req, res):
  - Extract id from req.params
  - Execute DELETE query
  - Return 200 on success or 404 if not found
```

**resourceController.js:**
```javascript
// Pseudo-interface
createResource(req, res):
  - Extract name, type, capacity, status from req.body
  - Validate required fields and capacity > 0
  - Execute INSERT query
  - Return 201 with created resource or 400/500 on error

getAllResources(req, res):
  - Execute SELECT query
  - Return 200 with resource array

updateResource(req, res):
  - Extract id from req.params and fields from req.body
  - Execute UPDATE query
  - Return 200 with updated resource or 404 if not found

deleteResource(req, res):
  - Extract id from req.params
  - Execute DELETE query
  - Return 200 on success or 404 if not found
```

**bookingController.js:**
```javascript
// Pseudo-interface
createBooking(req, res):
  - Extract userId, resourceId, bookingDate, timeSlot from req.body
  - Validate required fields
  - Check for existing booking with same resourceId, bookingDate, timeSlot
  - If exists, return 409 with "Resource already booked" error
  - Execute INSERT query
  - Return 201 with created booking or 400/500 on error

getAllBookings(req, res):
  - Execute SELECT query with JOINs to include user and resource details
  - Return 200 with booking array

updateBookingStatus(req, res):
  - Extract id from req.params and status from req.body
  - Validate status is PENDING, APPROVED, or REJECTED
  - Execute UPDATE query
  - Return 200 with updated booking or 404 if not found

getBookingsByUser(req, res):
  - Extract userId from req.params
  - Execute SELECT query with WHERE userId = ?
  - Return 200 with booking array

getBookingsByResource(req, res):
  - Extract resourceId from req.params
  - Execute SELECT query with WHERE resourceId = ?
  - Return 200 with booking array
```

### Frontend Components

**App.js:**
```javascript
// Main application component with routing
- Uses React Router to define routes:
  - /users -> Users page
  - /resources -> Resources page
  - /bookings -> Bookings page
- Includes navigation menu/header
```

**Users.js:**
```javascript
// User management page
- State: users array, loading, error
- On mount: fetch all users from GET /api/users
- Display users in table with columns: name, email, phone, role, status
- Actions: Edit button (opens UserForm), Delete button (calls DELETE endpoint)
- Include "Add User" button to open UserForm in create mode
```

**Resources.js:**
```javascript
// Resource management page
- State: resources array, loading, error
- On mount: fetch all resources from GET /api/resources
- Display resources in table with columns: name, type, capacity, status
- Actions: Edit button (inline form or modal), Delete button
- Include "Add Resource" button to create new resource
```

**Bookings.js:**
```javascript
// Booking management page
- State: bookings array, loading, error
- On mount: fetch all bookings from GET /api/bookings
- Display bookings in table with columns: user name, resource name, date, time slot, status
- Actions: Update status button (PENDING -> APPROVED/REJECTED)
- Include "Create Booking" button to open BookingForm
```

**UserForm.js:**
```javascript
// User create/edit form component
- Props: user (for edit mode), onSave callback, onCancel callback
- State: form fields (name, email, phone, role, status)
- Validation: all fields required, email format
- On submit: call POST /api/users (create) or PUT /api/users/:id (update)
- Display validation errors
```

**BookingForm.js:**
```javascript
// Booking creation form component
- Props: onSave callback, onCancel callback
- State: userId, resourceId, bookingDate, timeSlot
- On mount: fetch users and resources for dropdowns
- Validation: all fields required
- On submit: call POST /api/bookings
- Handle double-booking error (409) and display message
```

## Data Models

### User Model
```javascript
{
  id: number,              // Auto-generated
  name: string,            // Required, max 255 chars
  email: string,           // Required, unique, max 255 chars
  phone: string,           // Required, max 20 chars
  role: "STUDENT" | "STAFF",  // Required
  status: "ACTIVE" | "INACTIVE",  // Required, default ACTIVE
  createdAt: timestamp     // Auto-generated
}
```

### Resource Model
```javascript
{
  id: number,              // Auto-generated
  name: string,            // Required, max 255 chars
  type: "LAB" | "CLASSROOM" | "EVENT_HALL",  // Required
  capacity: number,        // Required, positive integer
  status: "AVAILABLE" | "UNAVAILABLE"  // Required, default AVAILABLE
}
```

### Booking Model
```javascript
{
  id: number,              // Auto-generated
  userId: number,          // Required, foreign key to users.id
  resourceId: number,      // Required, foreign key to resources.id
  bookingDate: date,       // Required, format: YYYY-MM-DD
  timeSlot: string,        // Required, e.g., "09:00-10:00"
  status: "PENDING" | "APPROVED" | "REJECTED"  // Required, default PENDING
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User email uniqueness
*For any* two users in the database, their email addresses should be different.
**Validates: Requirements 1.2**

### Property 2: User creation completeness
*For any* valid user creation request with all required fields (name, email, phone, role), the system should successfully create a user and return it with an auto-generated id and createdAt timestamp.
**Validates: Requirements 1.1, 1.3, 1.6**

### Property 3: User role constraint
*For any* user in the database, the role field should be either "STUDENT" or "STAFF" and no other value.
**Validates: Requirements 1.4**

### Property 4: User status constraint
*For any* user in the database, the status field should be either "ACTIVE" or "INACTIVE" and no other value.
**Validates: Requirements 1.5**

### Property 5: User retrieval by ID
*For any* user that exists in the database, retrieving that user by its ID should return the exact same user data.
**Validates: Requirements 1.8**

### Property 6: User update preserves unmodified fields
*For any* user update operation that modifies specific fields, all fields not included in the update should remain unchanged.
**Validates: Requirements 1.9**

### Property 7: User deletion removes record
*For any* user that is deleted, subsequent attempts to retrieve that user by ID should return a not-found error.
**Validates: Requirements 1.10**

### Property 8: User status filtering
*For any* status filter value (ACTIVE or INACTIVE), the filtered user list should contain only users with that exact status.
**Validates: Requirements 1.11**

### Property 9: Resource creation completeness
*For any* valid resource creation request with all required fields (name, type, capacity, status), the system should successfully create a resource and return it with an auto-generated id.
**Validates: Requirements 2.1, 2.2**

### Property 10: Resource type constraint
*For any* resource in the database, the type field should be one of "LAB", "CLASSROOM", or "EVENT_HALL" and no other value.
**Validates: Requirements 2.3**

### Property 11: Resource status constraint
*For any* resource in the database, the status field should be either "AVAILABLE" or "UNAVAILABLE" and no other value.
**Validates: Requirements 2.4**

### Property 12: Resource capacity validation
*For any* resource in the database, the capacity field should be a positive integer greater than zero.
**Validates: Requirements 2.5**

### Property 13: Booking foreign key integrity (userId)
*For any* booking creation request, if the userId does not reference an existing user, the system should reject the booking.
**Validates: Requirements 3.3**

### Property 14: Booking foreign key integrity (resourceId)
*For any* booking creation request, if the resourceId does not reference an existing resource, the system should reject the booking.
**Validates: Requirements 3.4**

### Property 15: Booking status constraint
*For any* booking in the database, the status field should be one of "PENDING", "APPROVED", or "REJECTED" and no other value.
**Validates: Requirements 3.5**

### Property 16: Booking default status
*For any* newly created booking where status is not explicitly provided, the status should default to "PENDING".
**Validates: Requirements 3.6**

### Property 17: Double-booking prevention
*For any* booking creation request, if another booking already exists with the same resourceId, bookingDate, and timeSlot, the system should reject the new booking request.
**Validates: Requirements 4.1, 4.2**

### Property 18: Booking retrieval by user
*For any* userId, retrieving bookings by that user should return only bookings where the userId matches.
**Validates: Requirements 3.9**

### Property 19: Booking retrieval by resource
*For any* resourceId, retrieving bookings by that resource should return only bookings where the resourceId matches.
**Validates: Requirements 3.10**

### Property 20: API success status codes
*For any* successful API operation (create, read, update), the response should include an appropriate 2xx status code (200 or 201).
**Validates: Requirements 5.2**

### Property 21: API error status codes
*For any* failed API operation due to client error (validation failure, not found, conflict), the response should include an appropriate 4xx status code.
**Validates: Requirements 5.3**

### Property 22: API JSON response format
*For any* API response that returns data, the response body should be valid JSON.
**Validates: Requirements 5.5**

### Property 23: Unique constraint violation handling
*For any* operation that violates a unique constraint (e.g., duplicate email), the system should return a 409 status code with a descriptive error message.
**Validates: Requirements 7.4**

### Property 24: Not found error handling
*For any* operation that attempts to access a non-existent resource by ID, the system should return a 404 status code with a descriptive error message.
**Validates: Requirements 7.3**

## Error Handling

### Backend Error Handling Strategy

**Database Errors:**
- Catch all database query errors using try-catch blocks
- Log errors to console for debugging
- Return appropriate HTTP status codes with error messages
- Handle specific MySQL error codes:
  - ER_DUP_ENTRY (1062): Return 409 Conflict for unique constraint violations
  - ER_NO_REFERENCED_ROW (1216): Return 400 Bad Request for foreign key violations

**Validation Errors:**
- Validate request body before database operations
- Check for required fields
- Validate enum values (role, status, type)
- Validate data types and formats
- Return 400 Bad Request with specific field error details

**Not Found Errors:**
- Check if query results are empty
- Return 404 Not Found with descriptive message (e.g., "User not found")

**Double-Booking Errors:**
- Query for existing bookings before creating new booking
- If conflict found, return 409 Conflict with message "Resource already booked for this date and time slot"

**Server Errors:**
- Catch unexpected errors
- Log full error stack trace
- Return 500 Internal Server Error with generic message (don't expose internal details)

### Frontend Error Handling Strategy

**API Request Errors:**
- Use try-catch with async/await for all API calls
- Display error messages to user using alerts or toast notifications
- Handle specific status codes:
  - 400: Show validation error details
  - 404: Show "Resource not found" message
  - 409: Show conflict message (e.g., "This resource is already booked")
  - 500: Show generic "Server error" message

**Form Validation:**
- Validate required fields before submission
- Show inline validation errors
- Disable submit button while request is in progress

**Loading States:**
- Show loading indicators during API requests
- Disable forms/buttons during submission
- Handle timeout scenarios

## Testing Strategy

### Unit Testing

Unit tests should focus on specific examples, edge cases, and error conditions. Avoid writing too many unit tests—property-based tests handle comprehensive input coverage.

**Backend Unit Tests:**
- Test individual controller functions with mock database responses
- Test specific validation scenarios (e.g., empty email, invalid role)
- Test error handling for specific error codes
- Test double-booking logic with concrete examples
- Test foreign key constraint violations

**Frontend Unit Tests:**
- Test form validation with specific invalid inputs
- Test component rendering with sample data
- Test error message display
- Test button click handlers

**Example Unit Test Cases:**
- Creating a user with duplicate email returns 409
- Creating a booking for non-existent user returns 400
- Deleting a user that doesn't exist returns 404
- Creating a booking with same resource/date/time returns 409
- Filtering users by "ACTIVE" status returns only active users

### Property-Based Testing

Property tests verify universal properties across all inputs using randomized test data. Each test should run a minimum of 100 iterations.

**Property Test Library:** Use `fast-check` for JavaScript/TypeScript property-based testing.

**Property Test Configuration:**
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `// Feature: campus-resource-management, Property {number}: {property_text}`

**Backend Property Tests:**

1. **Property 1 Test:** Generate random pairs of users, verify all have unique emails
   - Tag: `// Feature: campus-resource-management, Property 1: User email uniqueness`

2. **Property 2 Test:** Generate random valid user data, create users, verify all have id and createdAt
   - Tag: `// Feature: campus-resource-management, Property 2: User creation completeness`

3. **Property 3 Test:** Generate random users, verify all have role in ["STUDENT", "STAFF"]
   - Tag: `// Feature: campus-resource-management, Property 3: User role constraint`

4. **Property 17 Test:** Generate random bookings, attempt to create duplicate booking, verify rejection
   - Tag: `// Feature: campus-resource-management, Property 17: Double-booking prevention`

**Frontend Property Tests:**
- Property tests for frontend are less common but can test form validation logic
- Generate random form inputs and verify validation rules hold

### Integration Testing

Integration tests verify that components work together correctly:
- Test full API request/response cycles
- Test database operations with actual database (use test database)
- Test frontend-backend integration with mock API server

### Testing Priorities for Hackathon

Given the 5-6 hour time constraint, prioritize:
1. **Critical business logic:** Double-booking prevention (Property 17)
2. **Data integrity:** Foreign key constraints (Properties 13, 14)
3. **Validation:** Enum constraints (Properties 3, 4, 10, 11, 15)
4. **Core CRUD:** Basic create/read operations (Properties 2, 9)

Defer to post-hackathon:
- Comprehensive property test suite
- Frontend unit tests
- Performance testing
- End-to-end testing
