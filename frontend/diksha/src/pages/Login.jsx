import React, { useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/AuthPage.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);

      const role = res.data.user.role;

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else if (role === 'parent') {
        navigate('/parent/dashboard');
      } else {
        alert('Unknown role');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} className="auth-logo" alt="Logo" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p className="auth-toggle">
          Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
