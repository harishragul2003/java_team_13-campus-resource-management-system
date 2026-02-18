const db = require('../config/db');

// Login for all user types
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    // Check users table for all user types (STUDENT, STAFF, ADMIN)
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND status = ?',
      [email, password, userType, 'ACTIVE']
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    const user = {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      phone: users[0].phone,
      role: users[0].role,
      status: users[0].status,
      registerId: users[0].registerId
    };

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ message: 'User ID and type required' });
    }

    // Get user from users table (works for all user types)
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      phone: users[0].phone,
      role: users[0].role,
      status: users[0].status,
      registerId: users[0].registerId
    };

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
