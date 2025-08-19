import { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function AvailableCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/student/available-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (error) {
        setError(error?.message || 'Failed to load available courses.');
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  return (
    <div>
      <h2>Available Courses</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {courses.length === 0 && !error ? (
        <p>No available courses.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              {course.title} ({course.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AvailableCourses;
