# Campus Resource Management System

A full-stack web application for managing campus resources and bookings, built for a hackathon sprint.

## Tech Stack

- **Frontend**: React 18+, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+

## Features

✅ User Management (CRUD) - Create, view, update, delete users with roles (STUDENT/STAFF)  
✅ Resource Management (CRUD) - Manage campus resources (Labs, Classrooms, Event Halls)  
✅ Booking System - Book resources with date and time slots  
✅ Double-Booking Prevention - Automatic conflict detection  
✅ Status Management - Approve/Reject bookings (PENDING/APPROVED/REJECTED)  
✅ Clean UI - Professional, responsive interface  
✅ Error Handling - Comprehensive validation and error messages

## Project Structure

```
campus-resource-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── resourceController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── bookingRoutes.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Users.js
    │   │   ├── Resources.js
    │   │   └── Bookings.js
    │   ├── App.js
    │   └── api.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database:
   - Create MySQL database:
     ```sql
     CREATE DATABASE campus_db;
     ```
   - Update `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=campus_db
     PORT=5000
     ```
   - Run the schema:
     ```bash
     mysql -u root -p campus_db < database/schema.sql
     ```

4. Start the server:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Resources
- `POST /api/resources` - Create resource
- `GET /api/resources` - Get all resources
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/user/:userId` - Get bookings by user
- `GET /api/bookings/resource/:resourceId` - Get bookings by resource

## Features

- ✅ User Management (CRUD)
- ✅ Resource Management (CRUD)
- ✅ Booking System with double-booking prevention
- ✅ Status management (PENDING/APPROVED/REJECTED)
- ✅ RESTful API design
- ✅ Error handling

## License

ISC


## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users (optional ?status=ACTIVE filter)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Resources
- `POST /api/resources` - Create resource
- `GET /api/resources` - Get all resources
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Bookings
- `POST /api/bookings` - Create booking (with double-booking validation)
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/user/:userId` - Get bookings by user
- `GET /api/bookings/resource/:resourceId` - Get bookings by resource

## Usage

### Creating a User
1. Navigate to Users page
2. Click "Add New User"
3. Fill in name, email, phone, role (STUDENT/STAFF), and status
4. Click "Create User"

### Creating a Resource
1. Navigate to Resources page
2. Click "Add New Resource"
3. Fill in name, type (LAB/CLASSROOM/EVENT_HALL), capacity, and status
4. Click "Create Resource"

### Creating a Booking
1. Navigate to Bookings page
2. Click "Create New Booking"
3. Select user and resource from dropdowns
4. Choose booking date and enter time slot (e.g., "09:00-10:00")
5. Click "Create Booking"
6. System will prevent double-booking automatically

### Managing Bookings
- View all bookings with user and resource details
- Approve or reject pending bookings
- Status is color-coded: Green (APPROVED), Red (REJECTED), Orange (PENDING)

## Demo Flow for Hackathon

1. Create a few users (students and staff)
2. Create resources (labs, classrooms)
3. Create a booking for a resource
4. Try to create a duplicate booking → See validation error
5. Approve/reject bookings
6. Show the booking list with status updates

## Key Features for Judges

- **Double-Booking Prevention**: Automatic conflict detection prevents scheduling conflicts
- **Clean Architecture**: Separated controllers, routes, and database logic
- **RESTful API**: Follows REST conventions with proper HTTP status codes
- **Error Handling**: Comprehensive validation and user-friendly error messages
- **Responsive UI**: Clean, professional interface with intuitive navigation
- **Database Integrity**: Foreign key constraints and ENUM validations

## License

ISC
