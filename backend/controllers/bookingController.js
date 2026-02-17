const db = require('../config/db');
const emailService = require('../services/emailService');

// Create new booking with double-booking prevention
exports.createBooking = async (req, res) => {
  try {
    const { userId, resourceId, bookingDate, timeSlot, status = 'PENDING', duration = 1 } = req.body;

    // Validation
    if (!userId || !resourceId || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate duration (admin can book 1-3 days)
    const bookingDuration = parseInt(duration) || 1;
    if (bookingDuration < 1 || bookingDuration > 3) {
      return res.status(400).json({ message: 'Booking duration must be between 1 and 3 days' });
    }

    // Validate foreign keys - check if user exists
    const [users] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Validate foreign keys - check if resource exists
    const [resources] = await db.query('SELECT id FROM resources WHERE id = ?', [resourceId]);
    if (resources.length === 0) {
      return res.status(400).json({ message: 'Resource does not exist' });
    }

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, APPROVED, or REJECTED' });
    }

    // Create bookings for each day in the duration
    const bookingIds = [];
    for (let i = 0; i < bookingDuration; i++) {
      const currentDate = new Date(bookingDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      // CRITICAL: Check for double-booking on each day (only APPROVED bookings block slots)
      const [existingBookings] = await db.query(
        'SELECT * FROM bookings WHERE resourceId = ? AND bookingDate = ? AND timeSlot = ? AND status = ?',
        [resourceId, dateString, timeSlot, 'APPROVED']
      );

      if (existingBookings.length > 0) {
        return res.status(409).json({ 
          message: `Resource already booked (approved) for ${dateString} at ${timeSlot}` 
        });
      }

      // Create booking for this day
      const [result] = await db.query(
        'INSERT INTO bookings (userId, resourceId, bookingDate, timeSlot, status) VALUES (?, ?, ?, ?, ?)',
        [userId, resourceId, dateString, timeSlot, status]
      );
      
      bookingIds.push(result.insertId);
    }

    // Return the created bookings
    const [newBookings] = await db.query(
      'SELECT * FROM bookings WHERE id IN (?)',
      [bookingIds]
    );
    
    // Send email notification to admin if not admin booking
    if (status === 'PENDING') {
      const [user] = await db.query('SELECT name, email FROM users WHERE id = ?', [userId]);
      const [resource] = await db.query('SELECT name FROM resources WHERE id = ?', [resourceId]);
      
      if (user.length > 0 && resource.length > 0) {
        await emailService.notifyAdminNewBooking({
          userName: user[0].name,
          userEmail: user[0].email,
          resourceName: resource[0].name,
          bookingDate: bookingDate,
          timeSlot: timeSlot
        });
      }
    }
    
    res.status(201).json({
      message: `Successfully created ${bookingDuration} booking(s)`,
      bookings: newBookings
    });
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
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be PENDING, APPROVED, or REJECTED' });
    }

    // Check if booking exists
    const [existing] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update status and rejection reason
    if (status === 'REJECTED' && rejectionReason) {
      await db.query('UPDATE bookings SET status = ?, rejectionReason = ? WHERE id = ?', [status, rejectionReason, id]);
    } else {
      await db.query('UPDATE bookings SET status = ?, rejectionReason = NULL WHERE id = ?', [status, id]);
    }

    const [updatedBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    // Send email notification to user
    const [bookingDetails] = await db.query(`
      SELECT 
        b.*,
        u.name as userName,
        u.email as userEmail,
        r.name as resourceName
      FROM bookings b
      LEFT JOIN users u ON b.userId = u.id
      LEFT JOIN resources r ON b.resourceId = r.id
      WHERE b.id = ?
    `, [id]);
    
    if (bookingDetails.length > 0) {
      const details = bookingDetails[0];
      if (status === 'APPROVED') {
        await emailService.notifyUserApproval({
          userName: details.userName,
          userEmail: details.userEmail,
          resourceName: details.resourceName,
          bookingDate: details.bookingDate,
          timeSlot: details.timeSlot
        });
      } else if (status === 'REJECTED') {
        await emailService.notifyUserRejection({
          userName: details.userName,
          userEmail: details.userEmail,
          resourceName: details.resourceName,
          bookingDate: details.bookingDate,
          timeSlot: details.timeSlot,
          rejectionReason: rejectionReason || 'No reason provided'
        });
      }
    }
    
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

// Delete booking (Admin only - for cancellation)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if booking exists
    const [existing] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Delete booking
    await db.query('DELETE FROM bookings WHERE id = ?', [id]);

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
