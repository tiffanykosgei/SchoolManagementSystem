import React, { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

function CourseGradeSelector() {
  const [courses, setCourses] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/Teacher/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Select a Course to Manage Grades</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {courses.map(course => (
          <li key={course.courseId} style={{ margin: '10px 0' }}>
            <button
              onClick={() => navigate(`/teacher/grades/${course.courseId}`)}
              style={{ padding: '10px 15px', cursor: 'pointer' }}
            >
              {course.courseName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseGradeSelector;
