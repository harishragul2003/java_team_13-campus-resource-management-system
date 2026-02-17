import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Resources from './pages/Resources';
import Bookings from './pages/Bookings';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <div className="App">
          <Navbar user={user} onLogout={handleLogout} />
          <div className="container">
            <Routes>
              {user.role === 'ADMIN' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/bookings" element={<Bookings />} />
                </>
              )}
              {(user.role === 'STAFF' || user.role === 'STUDENT') && (
                <>
                  <Route path="/" element={<Bookings />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/bookings" element={<Bookings />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
