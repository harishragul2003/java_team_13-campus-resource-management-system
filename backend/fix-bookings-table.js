const db = require('./config/db');

async function fixBookingsTable() {
  try {
    console.log('🔧 Fixing bookings table schema...\n');
    
    // Backup existing bookings
    console.log('📦 Backing up existing bookings...');
    const [existingBookings] = await db.query('SELECT * FROM bookings');
    console.log(`Found ${existingBookings.length} existing bookings`);
    
    // Drop the bookings table
    console.log('🗑️  Dropping old bookings table...');
    await db.query('DROP TABLE IF EXISTS bookings');
    
    // Recreate with correct schema (camelCase)
    console.log('✨ Creating new bookings table with camelCase columns...');
    await db.query(`
      CREATE TABLE bookings (
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
    
    // Restore bookings if any existed
    if (existingBookings.length > 0) {
      console.log('📥 Restoring bookings...');
      for (const booking of existingBookings) {
        await db.query(
          'INSERT INTO bookings (userId, resourceId, bookingDate, timeSlot, status, rejectionReason) VALUES (?, ?, ?, ?, ?, ?)',
          [
            booking.userId || booking.user_id,
            booking.resourceId || booking.resource_id,
            booking.bookingDate || booking.booking_date,
            booking.timeSlot || booking.time_slot,
            booking.status,
            booking.rejectionReason || booking.rejection_reason
          ]
        );
      }
      console.log(`✅ Restored ${existingBookings.length} bookings`);
    }
    
    console.log('\n🎉 Bookings table fixed successfully!');
    console.log('New schema uses camelCase: userId, resourceId, bookingDate, timeSlot, rejectionReason');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing bookings table:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixBookingsTable();
