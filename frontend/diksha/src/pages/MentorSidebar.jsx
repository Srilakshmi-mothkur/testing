import React from 'react';

const MentorSidebar = ({ setActiveSection, active, onAskAnythingClick }) => {
    return (
        <aside
            style={{
                width: '250px',
                backgroundColor: '#f9fafb',
                borderRight: '1px solid #e5e7eb',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'sans-serif',
                boxShadow: 'inset -1px 0 0 #e5e7eb'
            }}
        >
            <h2 style={{ marginBottom: '2rem', color: '#111', fontWeight: 'bold' }}>🌟 Hello, Mentor!</h2>

            <button
                onClick={() => setActiveSection('analysis')}
                style={{
                    backgroundColor: active === 'analysis' ? '#f0fdf4' : '#fff',
                    border: active === 'analysis' ? '2px solid #22c55e' : '1px solid #d1d5db',
                    color: '#111',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '10px',
                    textAlign: 'left',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: active === 'analysis' ? '0 0 0 2px #bbf7d0' : 'none'
                }}
            >
                📊 Student Analysis
            </button>

            <button
                onClick={() => setActiveSection('update')}
                style={{
                    backgroundColor: active === 'update' ? '#f0fdf4' : '#fff',
                    border: active === 'update' ? '2px solid #22c55e' : '1px solid #d1d5db',
                    color: '#111',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '10px',
                    textAlign: 'left',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: active === 'update' ? '0 0 0 2px #bbf7d0' : 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                onMouseLeave={(e) => e.target.style.backgroundColor = active === 'update' ? '#f0fdf4' : '#fff'}
            >
                ✏️ Update Progress
            </button>

            <button
                onClick={onAskAnythingClick}
                style={{
                    backgroundColor: '#3b82f6', // Blue
                    color: '#fff',
                    padding: '0.75rem 1rem',
                    marginTop: 'auto',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
                💬 Ask Me Anything
            </button>
        </aside>
    );
};

export default MentorSidebar;
