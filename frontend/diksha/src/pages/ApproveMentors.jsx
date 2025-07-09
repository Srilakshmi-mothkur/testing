import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';

const ApproveMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/mentors/unapproved');
      setMentors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproval = async (id, approve) => {
    try {
      await axiosInstance.patch(`/api/admin/mentors/${id}/approval`, { isApproved: approve });
      fetchMentors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>📝 Pending Mentor Approvals</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {mentors.map(mentor => (
          <div key={mentor._id} style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>{mentor.name}</h4>
            <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {mentor.email}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>Phone:</strong> {mentor.phone}</p>
            {mentor.bio && <p style={{ margin: '0.25rem 0' }}><strong>Bio:</strong> {mentor.bio}</p>}
            {mentor.expertise?.length > 0 && (
              <p style={{ margin: '0.25rem 0' }}><strong>Expertise:</strong> {mentor.expertise.join(', ')}</p>
            )}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => handleApproval(mentor._id, true)}
                style={{ background: '#10b981', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(mentor._id, false)}
                style={{ background: '#ef4444', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px' }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveMentors;
