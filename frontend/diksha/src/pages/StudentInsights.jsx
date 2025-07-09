import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';

const StudentInsights = () => {
  const [studentInsights, setStudentInsights] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [topLeastSummary, setTopLeastSummary] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Fetch per-student insights
        const studentRes = await axiosInstance.get('/api/insights/student-wise', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentInsights(studentRes.data.insights);

        // Fetch top/least performer summary
        const compRes = await axiosInstance.get('/api/insights/top-vs-least',{
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopLeastSummary(compRes.data);
      } catch (error) {
        console.error('Error fetching student insights:', error);
      }
    };

    fetchInsights();
  }, [token]);

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>📈 Student Analysis & Insights</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {studentInsights.length === 0 && <p>No student insights available.</p>}
        {studentInsights.map((insight, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedStudent(insight)}
            style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem',
              width: '230px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{insight.student}</h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              {insight.trendSummary.length > 80
                ? insight.trendSummary.substring(0, 80) + '...'
                : insight.trendSummary}
            </p>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#fefce8',
            border: '1px solid #facc15',
          }}
        >
          <button
            onClick={() => setSelectedStudent(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#444',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontWeight: 'bold',
            }}
          >
            ← Back to list
          </button>
          <h3>Insights for {selectedStudent.student}</h3>
          <p>
            <strong>Feedback:</strong> {selectedStudent.feedback}
          </p>
          <p>
            <strong>Trend Summary:</strong> {selectedStudent.trendSummary}
          </p>
          <p>
            <strong>Recommendation:</strong> {selectedStudent.recommendation}
          </p>
        </div>
      )}

      {topLeastSummary && (
        <div
          style={{
            marginTop: '3rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <h3>🏆 Top Performer vs Least Performer</h3>
          <p>
            <strong>Top Performer:</strong> {topLeastSummary.topPerformer}
          </p>
          <p>
            <strong>Least Performer:</strong> {topLeastSummary.leastPerformer}
          </p>
          <p>
            <strong>Reason Top Performer Succeeds:</strong> {topLeastSummary.comparisonSummary.topPerformerReason}
          </p>
          <p>
            <strong>Main Struggle for Least Performer:</strong> {topLeastSummary.comparisonSummary.leastPerformerIssue}
          </p>
          <p>
            <strong>Mentor Advice:</strong> {topLeastSummary.comparisonSummary.mentorAdvice}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentInsights;
