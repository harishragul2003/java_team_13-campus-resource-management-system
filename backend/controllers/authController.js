const db = require('../config/db');

// Login for all user types
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    let user = null;
    let role = userType;

    if (userType === 'ADMIN') {
      // Check admin table
      const [admins] = await db.query(
        'SELECT * FROM admins WHERE email = ? AND password = ?',
        [email, password]
      );
      
      if (admins.length > 0) {
        user = {
          id: admins[0].id,
          name: admins[0].name,
          email: admins[0].email,
          role: 'ADMIN',
          username: admins[0].username
        };
      }
    } else {
      // Check users table for STUDENT or STAFF
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND status = ?',
        [email, password, userType, 'ACTIVE']
      );
      
      if (users.length > 0) {
        user = {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          phone: users[0].phone,
          role: users[0].role,
          status: users[0].status
        };
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ message: 'User ID and type required' });
    }

    let user = null;

    if (userType === 'ADMIN') {
      const [admins] = await db.query('SELECT * FROM admins WHERE id = ?', [userId]);
      if (admins.length > 0) {
        user = {
          id: admins[0].id,
          name: admins[0].name,
          email: admins[0].email,
          role: 'ADMIN',
          username: admins[0].username
        };
      }
    } else {
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
      if (users.length > 0) {
        user = {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          phone: users[0].phone,
          role: users[0].role,
          status: users[0].status
        };
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
