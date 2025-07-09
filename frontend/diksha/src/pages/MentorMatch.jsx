// MentorMatch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';


const MentorMatch = () => {
  const [students, setStudents] = useState([]);
  const [excluded, setExcluded] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    axiosInstance.get('/api/student/unassigned', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setStudents(res.data);
    }).catch(err => {
      console.error('Failed to load students:', err);
    });
  }, []);

  const getSuggestion = async (studentId) => {
    try {
      const res = await axiosInstance.post(
        `/api/match/suggest/${studentId}`,
        { excludedMentors: excluded[studentId] || [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions((prev) => ({ ...prev, [studentId]: res.data }));
    } catch (err) {
      alert('❌ No mentors left to suggest or error');
    }
  };

  const approveMatch = async (studentId, mentorId) => {
    try {
      await axiosInstance.post('/api/match/approve', {
        studentId, mentorId
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("✅ Mentor assigned");
      setStudents(students.filter(s => s._id !== studentId));
      setSuggestions(prev => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
    } catch (err) {
      alert("❌ Failed to approve match");
    }
  };

  const rejectMatch = (studentId, mentorId) => {
    setExcluded(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), mentorId]
    }));
    setSuggestions(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
    getSuggestion(studentId);
  };

  return (
    <div>
      <h2>🧠 Mentor Matching</h2>
      {students.map((student) => (
        <div key={student._id} style={{
          marginTop: '1rem',
          padding: '1.25rem',
          border: '1px solid #ddd',
          borderRadius: '12px',
          background: '#f9f9f9'
        }}>
          <h3>{student.name} ({student.languages?.join(', ')})</h3>
          <p>Skills: {student.skillTags?.join(', ')}</p>

          {!suggestions[student._id] ? (
            <button
              onClick={() => getSuggestion(student._id)}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔍 Suggest Mentor
            </button>
          ) : (
            <div>
              <p><strong>Suggested:</strong> {suggestions[student._id].mentorName}</p>
              <p><em>{suggestions[student._id].reason}</em></p>
              <button
                onClick={() => approveMatch(student._id, suggestions[student._id].mentorId)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  marginRight: '1rem',
                  cursor: 'pointer'
                }}
              >
                ✅ Approve
              </button>
              <button
                onClick={() => rejectMatch(student._id, suggestions[student._id].mentorId)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ❌ Try Another
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MentorMatch;
