import React, { useEffect, useState } from 'react';
import axios from '../../API/Axios'; // ✅ Adjust if your Axios setup file is elsewhere
import { useAuth } from '../../Contexts/AuthContext';

const TeacherAttendance = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // studentId => status

  useEffect(() => {
    fetchCourses();
  });

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/Course/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      const response = await axios.get(`/api/Teacher/students-in-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setAttendance({});
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    fetchStudents(courseId);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        courseId: parseInt(selectedCourseId),
        status
      }));

      await axios.post('/api/Attendance/mark', records, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Attendance marked successfully!');
      setAttendance({});
    } catch (err) {
      console.error('Failed to submit attendance:', err);
    }
  };

  return (
    <div>
      <h2>Teacher Attendance Management</h2>

      <div>
        <label>Select Course:</label>
        <select value={selectedCourseId} onChange={handleCourseChange}>
          <option value="">-- Select --</option>
          {courses.map(course => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <div>
          <h3>Mark Attendance</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.studentId}>
                  <td>{student.fullName}</td>
                  <td>
                    <select
                      value={attendance[student.studentId] || ''}
                      onChange={e =>
                        handleAttendanceChange(student.studentId, e.target.value)
                      }
                    >
                      <option value="">-- Select --</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;
