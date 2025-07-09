import React, { useState } from 'react';
import Sidebar from './AdminSidebar';
import ApproveMentors from './ApproveMentors';
import MentorMatch from './MentorMatch'; // ✅ Add this import
import { axiosInstance } from '../utils/axiosInstance';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('approveMentors');

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        backgroundColor: '#e0f2fe',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '95vw',
          height: '85vh',
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        <Sidebar setActiveSection={setActiveSection} active={activeSection} />
        <main
          style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          {activeSection === 'approveMentors' && <ApproveMentors />}
          {activeSection === 'mentorMatch' && <MentorMatch />} 
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
