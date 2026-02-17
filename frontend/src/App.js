import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Users from './pages/Users';
import Resources from './pages/Resources';
import Bookings from './pages/Bookings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
