import { useEffect, useState } from 'react';
import axios from '../../API/Axios';

const ChildCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/Parent/child-courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Child's Enrolled Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.courseId}>
            {course.courseName} - {course.courseDescription}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChildCourses;
