import React, { useState } from 'react';
import ParentSidebar from './ParentSidebar';
import AddStudent from './AddStudent';

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState('addStudent');

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#e0f2fe',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        width: '95vw',
        height: '85vh',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>
        <ParentSidebar setActiveSection={setActiveSection} active={activeSection} />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeSection === 'addStudent' && <AddStudent />}
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;
