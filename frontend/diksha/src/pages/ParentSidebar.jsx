import React from 'react';

const ParentSidebar = ({ setActiveSection, active }) => {
  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#fff',
      borderRight: '1px solid #e5e7eb',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ marginBottom: '2rem', color: '#111' }}>👋 Welcome, Parent!</h2>
      <button
        onClick={() => setActiveSection('addStudent')}
        style={{
          backgroundColor: active === 'addStudent' ? '#f0fdf4' : '#f9fafb',
          border: active === 'addStudent' ? '2px solid #22c55e' : '1px solid #ddd',
          color: '#111',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '10px',
          textAlign: 'left',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: active === 'addStudent' ? '0 0 0 2px #bbf7d0' : 'none'
        }}
      >
        🧒 Add Student
      </button>
    </aside>
  );
};

export default ParentSidebar;
