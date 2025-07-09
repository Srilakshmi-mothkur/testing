import React, { useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/AuthPage.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'mentor'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/auth/register', formData);
            alert('Registration successful! Await approval if mentor.');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <img src={logo} className="auth-logo" alt="Logo" />
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <select name="role" onChange={handleChange} defaultValue="mentor">
                        <option value="mentor">Mentor</option>
                        <option value="parent">Parent</option>
                    </select>
                    {formData.role === 'mentor' && (
                        <>
                            <textarea
                                name="bio"
                                placeholder="Brief Bio"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="expertise"
                                placeholder="Expertise (comma separated)"
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, expertise: e.target.value.split(',').map(item => item.trim()) }))
                                }
                            />
                            <input
                                type="text"
                                name="languages"
                                placeholder="Languages (comma separated)"
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, languages: e.target.value.split(',').map(item => item.trim()) }))
                                }
                            />
                        </>
                    )}

                    <button type="submit">Register</button>
                </form>
                <p className="auth-toggle">
                    Already have an account? <span onClick={() => navigate('/')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
