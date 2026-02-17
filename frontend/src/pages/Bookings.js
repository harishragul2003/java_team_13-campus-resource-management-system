import { useEffect, useState } from 'react';
import api from '../api';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    status: 'ALL',
    timeFilter: 'ALL',
    resourceId: 'ALL'
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [form, setForm] = useState({
    userId: '',
    resourceId: '',
    bookingDate: '',
    timeSlot: '', // For students/staff (single slot)
    timeSlots: [], // For admin (multiple slots)
    bookingEndDate: '', // For admin multi-day bookings
    duration: '1' // For admin: 1, 2, or 3 days
  });

  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  useEffect(() => {
    // Get logged in user
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    if (user) {
      setForm(prev => ({ ...prev, userId: user.id }));
    }
    
    fetchBookings();
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, filters]);

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

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data.filter(r => r.status === 'AVAILABLE'));
    } catch (err) {
      console.error('Failed to fetch resources', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];
    const today = new Date().toISOString().split('T')[0];

    // Filter by status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    // Filter by time
    if (filters.timeFilter === 'TODAY') {
      filtered = filtered.filter(b => b.bookingDate.split('T')[0] === today);
    } else if (filters.timeFilter === 'UPCOMING') {
      filtered = filtered.filter(b => b.bookingDate.split('T')[0] >= today);
    } else if (filters.timeFilter === 'PAST') {
      filtered = filtered.filter(b => b.bookingDate.split('T')[0] < today);
    }

    // Filter by resource
    if (filters.resourceId !== 'ALL') {
      filtered = filtered.filter(b => b.resourceId === parseInt(filters.resourceId));
    }

    setFilteredBookings(filtered);
  };

  const checkAvailability = async () => {
    if (!form.resourceId || !form.bookingDate) {
      setAvailableSlots(timeSlots);
      return;
    }

    try {
      const res = await api.get(`/bookings/resource/${form.resourceId}`);
      // Only block slots that are APPROVED (confirmed bookings)
      const bookedSlots = res.data
        .filter(b => 
          b.bookingDate.split('T')[0] === form.bookingDate && 
          b.status === 'APPROVED'
        )
        .map(b => b.timeSlot);
      
      setAvailableSlots(timeSlots.filter(slot => !bookedSlots.includes(slot)));
    } catch (err) {
      console.error('Failed to check availability', err);
      setAvailableSlots(timeSlots);
    }
  };

  useEffect(() => {
    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.resourceId, form.bookingDate, bookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for role-based slot limits
    const maxSlots = currentUser?.role === 'ADMIN' ? 999 : currentUser?.role === 'STAFF' ? 3 : 2;
    
    if (form.timeSlots.length === 0) {
      setError('Please select at least one time slot');
      return;
    }
    
    if (currentUser?.role !== 'ADMIN' && form.timeSlots.length > maxSlots) {
      setError(`${currentUser?.role === 'STAFF' ? 'Staff' : 'Students'} can book maximum ${maxSlots} hours`);
      return;
    }

    try {
      if (currentUser?.role === 'ADMIN') {
        // Admin: Create multiple bookings for selected slots (auto-approved)
        const bookingPromises = form.timeSlots.map(slot => {
          const bookingData = {
            userId: form.userId,
            resourceId: form.resourceId,
            bookingDate: form.bookingDate,
            timeSlot: slot,
            duration: parseInt(form.duration),
            status: 'APPROVED' // Admin bookings are auto-approved
          };
          return api.post('/bookings', bookingData);
        });

        await Promise.all(bookingPromises);
        
        const totalBookings = form.timeSlots.length * parseInt(form.duration);
        const durationText = form.duration > 1 ? ` for ${form.duration} days` : '';
        setSuccess(`Successfully created ${totalBookings} booking(s) (${form.timeSlots.length} slot(s)${durationText}) - Auto-approved!`);
      } else {
        // Student/Staff: Multiple bookings (needs approval)
        const bookingPromises = form.timeSlots.map(slot => {
          const bookingData = {
            userId: form.userId,
            resourceId: form.resourceId,
            bookingDate: form.bookingDate,
            timeSlot: slot
          };
          return api.post('/bookings', bookingData);
        });

        await Promise.all(bookingPromises);
        setSuccess(`Successfully created ${form.timeSlots.length} booking(s)! Waiting for approval.`);
      }

      fetchBookings();
      resetForm();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setSuccess('');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updateData = { status };
      
      // If rejecting with reason
      if (status === 'REJECTED' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      await api.put(`/bookings/${id}`, updateData);
      await fetchBookings();
      
      // Refresh availability after approval/rejection
      if (form.resourceId && form.bookingDate) {
        await checkAvailability();
      }
      
      setSuccess(`Booking ${status.toLowerCase()} successfully!`);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
      
      // Close modal and reset
      setShowRejectModal(false);
      setRejectBookingId(null);
      setRejectionReason('');
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const openRejectModal = (id) => {
    setRejectBookingId(id);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleRejectWithReason = () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      setTimeout(() => setError(''), 3000);
      return;
    }
    handleStatusUpdate(rejectBookingId, 'REJECTED');
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await api.delete(`/bookings/${id}`);
      await fetchBookings();
      
      // Refresh availability after cancellation
      if (form.resourceId && form.bookingDate) {
        await checkAvailability();
      }
      
      setSuccess('Booking cancelled successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const resetForm = () => {
    setForm({
      userId: currentUser?.id || '',
      resourceId: '',
      bookingDate: '',
      timeSlot: '',
      timeSlots: [],
      bookingEndDate: '',
      duration: '1'
    });
    setAvailableSlots(timeSlots);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: { icon: '✓' },
      PENDING: { icon: '⏳' },
      REJECTED: { icon: '✗' }
    };
    const style = styles[status] || styles.PENDING;
    
    return (
      <span className={`status-badge status-${status.toLowerCase()}`}>
        {style.icon} {status}
      </span>
    );
  };

  const getSelectedResource = () => {
    return resources.find(r => r.id === parseInt(form.resourceId));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="bookings-page">
      <h1 className="page-title">📅 My Bookings</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="bookings-grid">
        {/* Left Column - Booking Form */}
        <div className="card booking-form-card">
          <div className="card-header">
            <h2>Create New Booking</h2>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ New Booking'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="smart-booking-form">
              <div className="form-group">
                <label>👤 Booking For</label>
                <input
                  type="text"
                  value={currentUser?.name || 'Unknown User'}
                  disabled
                  className="form-input disabled-input"
                />
                <small className="form-hint">Logged in as {currentUser?.role}</small>
              </div>

              <div className="form-group">
                <label>🏢 Select Resource</label>
                <div className="resource-cards-grid">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className={`resource-card ${form.resourceId === resource.id.toString() ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, resourceId: resource.id.toString(), timeSlot: '' })}
                    >
                      <div className="resource-card-header">
                        <h4>{resource.name}</h4>
                        <span className="status-indicator">🟢</span>
                      </div>
                      <div className="resource-card-body">
                        <div className="resource-detail">
                          <span className="detail-icon">📍</span>
                          <span className="detail-text">{resource.type}</span>
                        </div>
                        <div className="resource-detail">
                          <span className="detail-icon">👥</span>
                          <span className="detail-text">Capacity: {resource.capacity}</span>
                        </div>
                      </div>
                      <div className="resource-card-footer">
                        {form.resourceId === resource.id.toString() ? (
                          <span className="selected-badge">✓ Selected</span>
                        ) : (
                          <span className="select-text">Click to select</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {resources.length === 0 && (
                  <div className="no-resources">
                    <p>No available resources</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>📅 Select Date</label>
                <input
                  type="date"
                  value={form.bookingDate}
                  onChange={(e) => setForm({ ...form, bookingDate: e.target.value, timeSlot: '' })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>

              {currentUser?.role === 'ADMIN' && form.bookingDate && (
                <div className="form-group">
                  <label>📆 Booking Duration (Admin Only)</label>
                  <div className="duration-options">
                    {[1, 2, 3].map((days) => (
                      <button
                        key={days}
                        type="button"
                        className={`duration-btn ${form.duration === days.toString() ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, duration: days.toString() })}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                  <small className="form-hint">
                    📌 Minimum: 1 hour | Maximum: 3 days
                  </small>
                </div>
              )}

              {form.resourceId && form.bookingDate && (
                <div className="form-group">
                  <label>⏰ Select Time Slot{currentUser?.role === 'ADMIN' ? 's (Multiple Selection)' : currentUser?.role === 'STAFF' ? 's (Max 3 hours)' : 's (Max 2 hours)'}</label>
                  <div className="time-slots-grid">
                    {timeSlots.map((slot) => {
                      const isAvailable = availableSlots.includes(slot);
                      const isSelected = form.timeSlots.includes(slot);
                      
                      // Check slot limits based on role
                      const maxSlots = currentUser?.role === 'ADMIN' ? 999 : currentUser?.role === 'STAFF' ? 3 : 2;
                      const canSelectMore = currentUser?.role === 'ADMIN' 
                        ? true 
                        : form.timeSlots.length < maxSlots;
                      
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`time-slot-btn ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                          onClick={() => {
                            if (!isAvailable) return;
                            
                            if (currentUser?.role === 'ADMIN') {
                              // Admin: Unlimited slots
                              const newSlots = form.timeSlots.includes(slot)
                                ? form.timeSlots.filter(s => s !== slot)
                                : [...form.timeSlots, slot];
                              setForm({ ...form, timeSlots: newSlots });
                            } else if (currentUser?.role === 'STAFF' || currentUser?.role === 'STUDENT') {
                              // Staff/Student: Multiple slots with limit
                              if (form.timeSlots.includes(slot)) {
                                // Deselect
                                const newSlots = form.timeSlots.filter(s => s !== slot);
                                setForm({ ...form, timeSlots: newSlots, timeSlot: '' });
                              } else if (canSelectMore) {
                                // Select if under limit
                                const newSlots = [...form.timeSlots, slot];
                                setForm({ ...form, timeSlots: newSlots, timeSlot: slot });
                              } else {
                                setError(`${currentUser?.role === 'STAFF' ? 'Staff' : 'Students'} can book maximum ${maxSlots} hours`);
                                setTimeout(() => setError(''), 3000);
                              }
                            }
                          }}
                          disabled={!isAvailable}
                        >
                          {slot}
                          {!isAvailable && <span className="blocked-label">🔒 Blocked</span>}
                        </button>
                      );
                    })}
                  </div>
                  <small className="availability-info">
                    ✓ {availableSlots.length} slots available | 🔒 {timeSlots.length - availableSlots.length} blocked
                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF' || currentUser?.role === 'STUDENT') && form.timeSlots.length > 0 && (
                      <span className="selected-count"> | 🎯 {form.timeSlots.length} slot(s) selected
                        {currentUser?.role !== 'ADMIN' && (
                          <span> (Max: {currentUser?.role === 'STAFF' ? '3' : '2'})</span>
                        )}
                      </span>
                    )}
                  </small>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={form.timeSlots.length === 0}
              >
                🎯 Book Now
                {form.timeSlots.length > 0 && (
                  <span> ({form.timeSlots.length} slot{form.timeSlots.length > 1 ? 's' : ''})</span>
                )}
              </button>
            </form>
          )}

          {!showForm && (
            <div className="booking-stats-summary">
              <div className="stat-item">
                <span className="stat-number">{bookings.filter(b => b.userId === currentUser?.id).length}</span>
                <span className="stat-label">My Bookings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{bookings.filter(b => b.userId === currentUser?.id && b.status === 'PENDING').length}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{bookings.filter(b => b.userId === currentUser?.id && b.status === 'APPROVED').length}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Bookings List with Filters */}
        <div className="card bookings-list-card">
          <h2>Booking History</h2>
          
          {/* Filters */}
          <div className="filters-container">
            <div className="filter-group">
              <label>📊 Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>📅 Time</label>
              <select
                value={filters.timeFilter}
                onChange={(e) => setFilters({ ...filters, timeFilter: e.target.value })}
                className="filter-select"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="PAST">Past</option>
              </select>
            </div>

            <div className="filter-group">
              <label>🏢 Resource</label>
              <select
                value={filters.resourceId}
                onChange={(e) => setFilters({ ...filters, resourceId: e.target.value })}
                className="filter-select"
              >
                <option value="ALL">All Resources</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  {currentUser?.role === 'ADMIN' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBookings
                  .filter(b => currentUser?.role === 'ADMIN' || b.userId === currentUser?.id)
                  .map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="resource-cell">
                        <strong>{booking.resourceName || `Resource #${booking.resourceId}`}</strong>
                        <small>{booking.resourceType}</small>
                      </div>
                    </td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td><span className="time-badge">{booking.timeSlot}</span></td>
                    <td>
                      {getStatusBadge(booking.status)}
                      {booking.status === 'REJECTED' && booking.rejectionReason && (
                        <div className="rejection-reason">
                          <small>❌ Reason: {booking.rejectionReason}</small>
                        </div>
                      )}
                    </td>
                    {currentUser?.role === 'ADMIN' && (
                      <td>
                        {booking.status === 'PENDING' && (
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-approve"
                              onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                              title="Approve"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-action btn-reject"
                              onClick={() => openRejectModal(booking.id)}
                              title="Reject"
                            >
                              ✗
                            </button>
                          </div>
                        )}
                        {booking.status === 'APPROVED' && (
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-cancel"
                              onClick={() => handleCancelBooking(booking.id)}
                              title="Cancel Booking"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                        {booking.status === 'REJECTED' && (
                          <span className="no-action">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.filter(b => currentUser?.role === 'ADMIN' || b.userId === currentUser?.id).length === 0 && (
              <div className="empty-state">
                <p>📭 No bookings found</p>
                <small>Create your first booking to get started</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <label>Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows="4"
                className="rejection-textarea"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleRejectWithReason}
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
