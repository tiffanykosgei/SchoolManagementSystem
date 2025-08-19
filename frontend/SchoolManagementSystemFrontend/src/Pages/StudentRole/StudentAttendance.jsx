import { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function StudentAttendance() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('/api/student/my-attendance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch attendance.');
        console.error(err);
      }
    };

    fetchAttendance();
  }, [token]);

  return (
    <div>
      <h2>My Attendance</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!stats ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p><strong>Present:</strong> {stats.Present}%</p>
          <p><strong>Absent:</strong> {stats.Absent}%</p>
          <p><strong>Late:</strong> {stats.Late}%</p>
        </div>
      )}
    </div>
  );
}

export default StudentAttendance;
