import React, { useEffect, useState } from 'react';
import axios from '../../API/Axios'; // your Axios instance
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function TeacherCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/Teacher/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(res.data);
      } catch {
        setError('Failed to fetch your courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleManageStudents = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Teaching Courses</h2>
      {courses.length === 0 ? (
        <p>You are not assigned to any courses.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {courses.map((course) => (
            <li key={course.courseId} style={styles.courseCard}>
              <h3>{course.courseName}</h3>
              <p>{course.courseDescription}</p>
              <button
                onClick={() => handleManageStudents(course.courseId)}
                style={styles.button}
              >
                Manage Students
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  courseCard: {
    backgroundColor: '#f4f4f4',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 4px rgba(0,0,0,0.1)'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default TeacherCourses;
