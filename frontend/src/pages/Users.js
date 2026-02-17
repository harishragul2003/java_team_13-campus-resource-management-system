import { useEffect, useState } from 'react';
import api from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    status: 'ACTIVE',
    password: 'password123'
  });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
      } else {
        await api.post('/users', form);
      }
      fetchUsers();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
        setError('');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'STUDENT',
      status: 'ACTIVE',
      password: 'password123'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1 className="page-title">User Management</h1>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone (10 digits)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  if (value.length <= 10) {
                    setForm({ ...form, phone: value });
                  }
                }}
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10 digit phone number"
                required
              />
              {form.phone && form.phone.length !== 10 && (
                <small style={{ color: 'red' }}>Phone must be exactly 10 digits</small>
              )}
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update User' : 'Create User'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={resetForm}
                style={{ marginLeft: '1rem' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}
      </div>

      <div className="card">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No users found</p>}
      </div>
    </div>
  );
}

export default Users;
