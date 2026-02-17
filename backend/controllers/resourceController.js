const db = require('../config/db');

// Create new resource
exports.createResource = async (req, res) => {
  try {
    const { name, type, capacity, status = 'AVAILABLE' } = req.body;

    // Validation
    if (!name || !type || !capacity) {
      return res.status(400).json({ message: 'Name, type, and capacity are required' });
    }

    if (!['LAB', 'CLASSROOM', 'EVENT_HALL'].includes(type)) {
      return res.status(400).json({ message: 'Type must be LAB, CLASSROOM, or EVENT_HALL' });
    }

    if (!['AVAILABLE', 'UNAVAILABLE'].includes(status)) {
      return res.status(400).json({ message: 'Status must be AVAILABLE or UNAVAILABLE' });
    }

    if (capacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0' });
    }

    const [result] = await db.query(
      'INSERT INTO resources (name, type, capacity, status) VALUES (?, ?, ?, ?)',
      [name, type, capacity, status]
    );

    const [newResource] = await db.query('SELECT * FROM resources WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newResource[0]);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const [resources] = await db.query('SELECT * FROM resources');
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, capacity, status } = req.body;

    // Check if resource exists
    const [existing] = await db.query('SELECT * FROM resources WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (type) {
      if (!['LAB', 'CLASSROOM', 'EVENT_HALL'].includes(type)) {
        return res.status(400).json({ message: 'Type must be LAB, CLASSROOM, or EVENT_HALL' });
      }
      updates.push('type = ?');
      values.push(type);
    }
    if (capacity) {
      if (capacity <= 0) {
        return res.status(400).json({ message: 'Capacity must be greater than 0' });
      }
      updates.push('capacity = ?');
      values.push(capacity);
    }
    if (status) {
      if (!['AVAILABLE', 'UNAVAILABLE'].includes(status)) {
        return res.status(400).json({ message: 'Status must be AVAILABLE or UNAVAILABLE' });
      }
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    await db.query(`UPDATE resources SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedResource] = await db.query('SELECT * FROM resources WHERE id = ?', [id]);
    res.status(200).json(updatedResource[0]);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM resources WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
