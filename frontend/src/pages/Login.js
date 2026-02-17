import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    userType: 'STUDENT',
    name: '',
    phone: '',
    registerId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
          userType: form.userType
        });
        const userData = response.data.user;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
      } else {
        // Create Account
        if (form.userType === 'ADMIN') {
          setError('Cannot create admin accounts from here');
          setLoading(false);
          return;
        }

        await api.post('/users', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.userType,
          password: form.password,
          status: 'ACTIVE',
          registerId: form.registerId
        });

        // Auto login after account creation
        const response = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
          userType: form.userType
        });
        const userData = response.data.user;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed' : 'Account creation failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({
      email: '',
      password: '',
      userType: 'STUDENT',
      name: '',
      phone: '',
      registerId: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏫 Campus Resource Management</h1>
          <p>{isLogin ? 'Sign in to continue' : 'Create your account'}</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>User Type</label>
            <select
              value={form.userType}
              onChange={(e) => setForm({ ...form, userType: e.target.value })}
              className="login-select"
            >
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              {isLogin && <option value="ADMIN">Admin</option>}
            </select>
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  {form.userType === 'STUDENT' ? '📝 Register Number' : '🆔 Staff ID'}
                </label>
                <input
                  type="text"
                  value={form.registerId}
                  onChange={(e) => setForm({ ...form, registerId: e.target.value })}
                  placeholder={form.userType === 'STUDENT' ? 'Enter register number (e.g., 2024001)' : 'Enter staff ID (e.g., STF001)'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number (10 digits)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setForm({ ...form, phone: value });
                    }
                  }}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="Enter 10 digit phone number"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="login-footer">
          <p className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="toggle-btn">
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
