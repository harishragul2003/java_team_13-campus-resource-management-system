import { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    availableResources: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, resourcesRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/resources'),
        api.get('/bookings')
      ]);

      const users = usersRes.data;
      const resources = resourcesRes.data;
      const bookings = bookingsRes.data;

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'ACTIVE').length,
        totalResources: resources.length,
        availableResources: resources.filter(r => r.status === 'AVAILABLE').length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        approvedBookings: bookings.filter(b => b.status === 'APPROVED').length,
        rejectedBookings: bookings.filter(b => b.status === 'REJECTED').length
      });

      // Get recent 5 bookings
      setRecentBookings(bookings.slice(-5).reverse());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <small>{stats.activeUsers} Active</small>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Total Resources</h3>
            <p className="stat-number">{stats.totalResources}</p>
            <small>{stats.availableResources} Available</small>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats.totalBookings}</p>
            <small>{stats.approvedBookings} Approved</small>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Bookings</h3>
            <p className="stat-number">{stats.pendingBookings}</p>
            <small>Awaiting approval</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-card">
          <h2>Booking Statistics</h2>
          <div className="booking-stats">
            <div className="booking-stat">
              <span className="stat-label">Approved</span>
              <span className="stat-value approved">{stats.approvedBookings}</span>
            </div>
            <div className="booking-stat">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{stats.pendingBookings}</span>
            </div>
            <div className="booking-stat">
              <span className="stat-label">Rejected</span>
              <span className="stat-value rejected">{stats.rejectedBookings}</span>
            </div>
          </div>
        </div>

        <div className="card dashboard-card">
          <h2>System Overview</h2>
          <div className="overview-list">
            <div className="overview-item">
              <span>Active Users</span>
              <span className="overview-value">{stats.activeUsers} / {stats.totalUsers}</span>
            </div>
            <div className="overview-item">
              <span>Available Resources</span>
              <span className="overview-value">{stats.availableResources} / {stats.totalResources}</span>
            </div>
            <div className="overview-item">
              <span>Approval Rate</span>
              <span className="overview-value">
                {stats.totalBookings > 0 
                  ? Math.round((stats.approvedBookings / stats.totalBookings) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Bookings</h2>
        {recentBookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Resource</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No bookings yet
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
