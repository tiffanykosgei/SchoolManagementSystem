import React, { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function TeacherProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/Teacher/my-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err); // Optional: log for debugging
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      {profile && (
        <div style={styles.profileBox}>
          <p><strong>Full Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Employee Number:</strong> {profile.employeeNumber}</p> {/* ✅ fixed typo */}
          <p><strong>Telephone Number:</strong> {profile.telephoneNumber || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem'
  },
  profileBox: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '600px'
  }
};

export default TeacherProfile;
