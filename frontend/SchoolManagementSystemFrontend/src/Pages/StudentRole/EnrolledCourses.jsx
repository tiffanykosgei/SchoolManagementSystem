import { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function EnrolledCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/student/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
        setError(''); // clear error on success
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load enrolled courses.';
        setError(message);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  return (
    <div>
      <h2>My Enrolled Courses</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {courses.length === 0 && !error ? (
        <p>No courses enrolled.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              {course.title} ({course.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EnrolledCourses;
