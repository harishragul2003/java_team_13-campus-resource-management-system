const db = require('../config/db');

// Create new booking with double-booking prevention
exports.createBooking = async (req, res) => {
  try {
    const { userId, resourceId, bookingDate, timeSlot, status = 'PENDING' } = req.body;

    // Validation
    if (!userId || !resourceId || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate foreign keys - check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Validate foreign keys - check if resource exists
    const [resources] = await db.query('SELECT id FROM resources WHERE id = ?', [resourceId]);
    if (resources.length === 0) {
      return res.status(400).json({ message: 'Resource does not exist' });
    }

    // CRITICAL: Check for double-booking
    const [existingBookings] = await db.query(
      'SELECT * FROM bookings WHERE resourceId = ? AND bookingDate = ? AND timeSlot = ?',
      [resourceId, bookingDate, timeSlot]
    );

    if (existingBookings.length > 0) {
      return res.status(409).json({ 
        message: 'Resource already booked for this date and time slot' 
      });
    }

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, APPROVED, or REJECTED' });
    }

    // Create booking
    const [result] = await db.query(
      'INSERT INTO bookings (userId, resourceId, bookingDate, timeSlot, status) VALUES (?, ?, ?, ?, ?)',
      [userId, resourceId, bookingDate, timeSlot, status]
    );

    const [newBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newBooking[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all bookings with user and resource details
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.*,
        u.name as userName,
        u.email as userEmail,
        r.name as resourceName,
        r.type as resourceType
      FROM bookings b
      LEFT JOIN users u ON b.userId = u.id
      LEFT JOIN resources r ON b.resourceId = r.id
    `);
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, APPROVED, or REJECTED' });
    }

    // Check if booking exists
    const [existing] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update status
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    const [updatedBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    res.status(200).json(updatedBooking[0]);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get bookings by user
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [bookings] = await db.query(`
      SELECT 
        b.*,
        r.name as resourceName,
        r.type as resourceType
      FROM bookings b
      LEFT JOIN resources r ON b.resourceId = r.id
      WHERE b.userId = ?
    `, [userId]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get bookings by resource
exports.getBookingsByResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const [bookings] = await db.query(`
      SELECT 
        b.*,
        u.name as userName,
        u.email as userEmail
      FROM bookings b
      LEFT JOIN users u ON b.userId = u.id
      WHERE b.resourceId = ?
    `, [resourceId]);

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching resource bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
