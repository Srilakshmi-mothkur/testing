import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';
import MentorSidebar from './MentorSidebar';
import StudentUpdate from './StudentUpdate';
import StudentInsights from './StudentInsights'; // New import
import MentorChatbot from './MentorChatbot'; // Import chatbot component

const MentorDashboard = () => {
  const [activeSection, setActiveSection] = useState('update');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get('/api/mentor/students', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStudents(res.data.students || []);
        console.log("✅ Students loaded:", res.data.students);

      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        backgroundColor: '#ecfeff',
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
          position: 'relative', // for chatbot overlay positioning
        }}
      >
        <MentorSidebar
          setActiveSection={setActiveSection}
          active={activeSection}
          onAskAnythingClick={() => setShowChatbot(true)}
        />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeSection === 'update' && (
            <>
              {!selectedStudent ? (
                <>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span role="img" aria-label="book">
                      📚
                    </span>{' '}
                    Your Assigned Students
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      marginTop: '1.5rem',
                    }}
                  >
                    {students.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => setSelectedStudent(student)}
                        style={{
                          backgroundColor: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '1rem',
                          width: '230px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
                          e.currentTarget.style.backgroundColor = '#eef2ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '0.3rem',
                            color: '#111827',
                          }}
                        >
                          {student.name}
                        </h3>
                        <small
                          style={{
                            color: '#4b5563',
                            fontSize: '0.9rem',
                            display: 'block',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {student.age} yrs • {student.gender}
                        </small>
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: '#374151',
                          }}
                        >
                          {student.skillTags?.join(', ') || 'No interests added'}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <StudentUpdate student={selectedStudent} goBack={() => setSelectedStudent(null)} />
              )}
            </>
          )}

          {activeSection === 'analysis' && <StudentInsights />}
        </main>

        {showChatbot && <MentorChatbot onClose={() => setShowChatbot(false)} />}
      </div>
    </div>
  );
};

export default MentorDashboard;
