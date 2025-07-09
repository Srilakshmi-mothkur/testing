import React, { useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';


const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    skillTags: '',
    languages: '',
    parentContact: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // if using JWT
      await axiosInstance.post('/api/student/create', {
        ...formData,
        skillTags: formData.skillTags.split(',').map((s) => s.trim()),
        languages: formData.languages.split(',').map((l) => l.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Student added!');
      setFormData({
        name: '', age: '', gender: '', address: '',
        skillTags: '', languages: '', parentContact: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add student');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <form onSubmit={handleSubmit}
        style={{
          backgroundColor: '#f8fafc',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>👧 Add Student Details</h2>
        {['name', 'age', 'gender', 'address', 'skillTags', 'languages', 'parentContact'].map((field, i) => (
          <input
            key={i}
            type="text"
            name={field}
            placeholder={
              field === 'skillTags' ? 'Skills (comma-separated)' :
              field === 'languages' ? 'Languages (comma-separated)' :
              field === 'parentContact' ? 'Parent Contact' :
              field.charAt(0).toUpperCase() + field.slice(1)
            }
            value={formData[field]}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          />
        ))}
        <button type="submit"
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
          <span style={{ fontSize: '1.2rem' }}>➕</span> Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
