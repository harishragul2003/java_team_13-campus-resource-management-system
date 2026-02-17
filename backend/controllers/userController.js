const db = require('../config/db');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, role, status = 'ACTIVE' } = req.body;

    // Validation
    if (!name || !email || !phone || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['STUDENT', 'STAFF'].includes(role)) {
      return res.status(400).json({ message: 'Role must be STUDENT or STAFF' });
    }

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ message: 'Status must be ACTIVE or INACTIVE' });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, role, status]
    );

    const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users with optional status filter
exports.getAllUsers = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = 'SELECT * FROM users';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [users] = await db.query(query, params);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;

    // Check if user exists
    const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (role) {
      if (!['STUDENT', 'STAFF'].includes(role)) {
        return res.status(400).json({ message: 'Role must be STUDENT or STAFF' });
      }
      updates.push('role = ?');
      values.push(role);
    }
    if (status) {
      if (!['ACTIVE', 'INACTIVE'].includes(status)) {
        return res.status(400).json({ message: 'Status must be ACTIVE or INACTIVE' });
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
