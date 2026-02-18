const db = require('./config/db');

async function checkDatabase() {
  try {
    console.log('Checking database structure...\n');
    
    // Check users table
    console.log('=== USERS TABLE ===');
    const [users] = await db.query('SELECT * FROM users LIMIT 3');
    console.log(`Found ${users.length} users`);
    if (users.length > 0) {
      console.log('Sample user:', users[0]);
    }
    
    // Check resources table
    console.log('\n=== RESOURCES TABLE ===');
    const [resources] = await db.query('SELECT * FROM resources LIMIT 3');
    console.log(`Found ${resources.length} resources`);
    if (resources.length > 0) {
      console.log('Sample resource:', resources[0]);
    }
    
    // Check bookings table structure
    console.log('\n=== BOOKINGS TABLE ===');
    const [columns] = await db.query('DESCRIBE bookings');
    console.log('Columns:', columns.map(c => c.Field).join(', '));
    
    // Check bookings data
    const [bookings] = await db.query('SELECT * FROM bookings LIMIT 3');
    console.log(`Found ${bookings.length} bookings`);
    if (bookings.length > 0) {
      console.log('Sample booking:', bookings[0]);
    }
    
    console.log('\n✅ Database check complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

checkDatabase();
