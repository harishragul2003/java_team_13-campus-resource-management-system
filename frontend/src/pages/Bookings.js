import { useEffect, useState } from 'react';
import api from '../api';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    resourceId: '',
    bookingDate: '',
    timeSlot: ''
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      setBookings(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndResources = async () => {
    try {
      const [usersRes, resourcesRes] = await Promise.all([
        api.get('/users'),
        api.get('/resources')
      ]);
      setUsers(usersRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      console.error('Failed to fetch users/resources', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUsersAndResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      fetchBookings();
      resetForm();
      setSuccess('Booking created successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setSuccess('');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      fetchBookings();
      setSuccess(`Booking ${status.toLowerCase()} successfully!`);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      resourceId: '',
      bookingDate: '',
      timeSlot: ''
    });
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Booking Management</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Booking'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>User</label>
              <select
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Resource</label>
              <select
                value={form.resourceId}
                onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
                required
              >
                <option value="">Select Resource</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.type}) - Capacity: {resource.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Booking Date</label>
              <input
                type="date"
                value={form.bookingDate}
                onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Time Slot</label>
              <input
                type="text"
                placeholder="e.g., 09:00-10:00"
                value={form.timeSlot}
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Booking
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h2>All Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Resource</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.userName || `User #${booking.userId}`}</td>
                <td>{booking.resourceName || `Resource #${booking.resourceId}`}</td>
                <td>{formatDate(booking.bookingDate)}</td>
                <td>{booking.timeSlot}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: 
                      booking.status === 'APPROVED' ? '#4CAF50' :
                      booking.status === 'REJECTED' ? '#f44336' :
                      '#ff9800',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status !== 'PENDING' && (
                    <span style={{ color: '#999' }}>No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</p>}
      </div>
    </div>
  );
}

export default Bookings;
