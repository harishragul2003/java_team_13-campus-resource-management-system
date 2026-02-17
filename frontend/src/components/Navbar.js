import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Campus Resource Management</h2>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Users</Link>
        <Link to="/resources" className="nav-link">Resources</Link>
        <Link to="/bookings" className="nav-link">Bookings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
