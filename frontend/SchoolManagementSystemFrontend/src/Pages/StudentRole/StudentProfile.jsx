import { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function StudentProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/student/profile');
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile.');
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.fullName}</p>
      <p><strong>Admission Number:</strong> {profile.admissionNumber}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      <h3>Enrolled Courses</h3>
      <ul>
        {profile.courses?.length > 0 ? (
          profile.courses.map((course) => <li key={course.id}>{course.title}</li>)
        ) : (
          <li>No courses assigned.</li>
        )}
      </ul>
    </div>
  );
}

export default StudentProfile;
