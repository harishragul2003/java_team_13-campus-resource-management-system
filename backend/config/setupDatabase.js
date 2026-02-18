const db = require('./db');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database tables...');
    
    // Wait a bit for database connection to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        role ENUM('STUDENT', 'STAFF', 'ADMIN') NOT NULL,
        status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        password VARCHAR(255) NOT NULL,
        registerId VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');
    
    // Add registerId column if it doesn't exist (for existing databases)
    try {
      await db.query(`
        ALTER TABLE users ADD COLUMN registerId VARCHAR(50)
      `);
      console.log('✅ Added registerId column to users table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ registerId column already exists');
      } else {
        console.log('⚠️  Could not add registerId column:', err.message);
      }
    }

    // Create resources table
    await db.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('LAB', 'CLASSROOM', 'EVENT_HALL') NOT NULL,
        capacity INT NOT NULL,
        status ENUM('AVAILABLE', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE'
      )
    `);
    console.log('✅ Resources table created/verified');

    // Create bookings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        resourceId INT NOT NULL,
        bookingDate DATE NOT NULL,
        timeSlot VARCHAR(50) NOT NULL,
        status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
        rejectionReason TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (resourceId) REFERENCES resources(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Bookings table created/verified');
    
    // Add rejectionReason column if it doesn't exist
    try {
      await db.query(`
        ALTER TABLE bookings ADD COLUMN rejectionReason TEXT
      `);
      console.log('✅ Added rejectionReason column to bookings table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ rejectionReason column already exists');
      } else {
        console.log('⚠️  Could not add rejectionReason column:', err.message);
      }
    }

    // Check if admin exists, if not create one
    const [adminCheck] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@campus.com']);
    
    if (adminCheck.length === 0) {
      await db.query(
        'INSERT INTO users (name, email, phone, role, status, password) VALUES (?, ?, ?, ?, ?, ?)',
        ['Admin', 'admin@campus.com', '0000000000', 'ADMIN', 'ACTIVE', 'admin123']
      );
      console.log('✅ Admin user created (admin@campus.com / admin123)');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if resources exist, if not create sample resources
    const [resourceCheck] = await db.query('SELECT * FROM resources');
    
    if (resourceCheck.length === 0) {
      await db.query(`
        INSERT INTO resources (name, type, capacity, status) VALUES
        ('Seminar Hall A', 'EVENT_HALL', 100, 'AVAILABLE'),
        ('Computer Lab 1', 'LAB', 40, 'AVAILABLE'),
        ('Auditorium', 'EVENT_HALL', 300, 'UNAVAILABLE')
      `);
      console.log('✅ Sample resources created');
    } else {
      console.log('✅ Resources already exist');
    }

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('⚠️  Continuing without database setup - tables may need manual creation');
    // Don't throw error, allow server to start
  }
}

module.exports = setupDatabase;
