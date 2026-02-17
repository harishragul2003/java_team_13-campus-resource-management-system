# Campus Resource Management System

A full-stack web application for managing campus resources and bookings, built for a hackathon sprint.

## 🚀 Features

✅ **Authentication System** - Role-based login (Student/Staff/Admin)  
✅ **User Management** - CRUD operations with register number/staff ID  
✅ **Resource Management** - Card-based resource selection with capacity display  
✅ **Smart Booking System** - Multi-slot booking with role-based limits  
✅ **Admin Dashboard** - Statistics and booking overview  
✅ **Email Notifications** - Automated emails for booking requests and approvals  
✅ **Double-Booking Prevention** - Only approved bookings block slots  
✅ **Rejection Reasons** - Admin can provide reasons when rejecting bookings  
✅ **Multi-Day Booking** - Admin can book resources for 1-3 days  
✅ **Professional UI** - Modern, responsive design with color-coded status badges

## 📋 Role-Based Features

### Students
- Book 1-2 time slots per booking
- View own bookings only
- Receive email notifications on approval/rejection

### Staff
- Book 1-3 time slots per booking
- View own bookings only
- Receive email notifications on approval/rejection

### Admin
- Unlimited slot booking
- Multi-day booking (1-3 days)
- View all bookings
- Approve/reject with reasons
- Cancel approved bookings
- Auto-approved bookings
- Receive email notifications for new booking requests

## 🛠️ Tech Stack

- **Frontend**: React 18+, React Router, Axios
- **Backend**: Node.js, Express.js, Nodemailer
- **Database**: MySQL 8.0+

## 📁 Project Structure

```
campus-resource-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── resourceController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── bookingRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── database/
│   │   ├── schema.sql
│   │   ├── add_auth.sql
│   │   ├── add_resources.sql
│   │   └── fix_schema.sql
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Users.js
    │   │   ├── Resources.js
    │   │   └── Bookings.js
    │   ├── App.js
    │   └── api.js
    └── package.json
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Gmail account (for email notifications)

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
   - Update `.env` file:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=campus_db
     PORT=5000
     
     # Email Configuration
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     ADMIN_EMAIL=admin@campus.com
     ```
   - Run the schema:
     ```bash
     mysql -u root -p campus_db < database/schema.sql
     mysql -u root -p campus_db < database/add_auth.sql
     mysql -u root -p campus_db < database/add_resources.sql
     ```

4. Start the server:
   ```bash
   node server.js
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

## 📧 Email Configuration

To enable email notifications:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Update `.env` file with your email and app password

## 🔑 Default Credentials

**Admin:**
- Email: admin@campus.com
- Password: admin123

**Note:** Create Student/Staff accounts through the registration page.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/users` - Create account (Student/Staff)

### Users
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
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/user/:userId` - Get bookings by user
- `GET /api/bookings/resource/:resourceId` - Get bookings by resource

## 🎯 Key Features for Demo

1. **Authentication Flow** - Login as Student/Staff/Admin
2. **Card-Based Resource Selection** - Visual, interactive resource cards
3. **Multi-Slot Booking** - Select multiple time slots with role-based limits
4. **Real-Time Availability** - Blocked slots update instantly
5. **Email Notifications** - Automated emails for all booking actions
6. **Admin Dashboard** - Statistics and booking management
7. **Rejection with Reasons** - Transparent communication
8. **Multi-Day Booking** - Admin can book for consecutive days

## 🏆 Hackathon Highlights

- **Professional UI/UX** - Modern design with smooth interactions
- **Role-Based Access Control** - Different features for different user types
- **Smart Validation** - Prevents conflicts and enforces business rules
- **Email Integration** - Real-world notification system
- **Scalable Architecture** - Clean separation of concerns
- **Database Integrity** - Foreign keys and proper constraints

## 📝 License

ISC

## 👥 Team

Java Team 13 - Campus Resource Management System
