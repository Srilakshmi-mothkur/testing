import React from 'react';

const Sidebar = ({ setActiveSection, active }) => {
  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h2 style={{ marginBottom: '2rem', color: '#111' }}>👋 Welcome, Admin!</h2>
      <button
        onClick={() => setActiveSection('approveMentors')}
        style={{
          backgroundColor: active === 'approveMentors' ? '#f0fdf4' : '#f9fafb',
          border: active === 'approveMentors' ? '2px solid #22c55e' : '1px solid #ddd',
          color: '#111',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '10px',
          textAlign: 'left',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: active === 'approveMentors' ? '0 0 0 2px #bbf7d0' : 'none'
        }}
      >
        ✅ Approve Mentors
      </button>

      <button
        onClick={() => setActiveSection('mentorMatch')}
        style={{
          backgroundColor: active === 'mentorMatch' ? '#f0fdf4' : '#f9fafb',
          border: active === 'mentorMatch' ? '2px solid #22c55e' : '1px solid #ddd',
          color: '#111',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '10px',
          textAlign: 'left',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: active === 'mentorMatch' ? '0 0 0 2px #bbf7d0' : 'none'
        }}
      >
        🧠 Mentor Match
      </button>

    </aside>
  );
};

export default Sidebar;
