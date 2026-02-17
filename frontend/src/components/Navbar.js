import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Campus Resource Management</h2>
      </div>
      <div className="navbar-links">
        {user.role === 'ADMIN' && (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/users" className="nav-link">Users</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/bookings" className="nav-link">Bookings</Link>
          </>
        )}
        {(user.role === 'STAFF' || user.role === 'STUDENT') && (
          <>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/bookings" className="nav-link">My Bookings</Link>
          </>
        )}
        <div className="nav-user">
          <span className="user-name">{user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
