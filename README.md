# Campus Resource Management System

A full-stack web application for managing campus resources and bookings, built for a hackathon sprint.

## Tech Stack

- **Frontend**: React 18+
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+

## Project Structure

```
campus-resource-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── bookingRoutes.js
│   ├── controllers/
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    └── (React app)
```

## Setup Instructions

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
   - Create MySQL database: `campus_db`
   - Update `.env` file with your database credentials
   - Run the schema: `mysql -u root -p campus_db < database/schema.sql`

4. Start the server:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

### Frontend Setup

Coming soon...

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
