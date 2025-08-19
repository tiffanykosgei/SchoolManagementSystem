import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function EnrolledStudents() {
  const { id: courseId } = useParams();
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`/api/Teacher/course-students/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(res.data.students);
        setCourseName(res.data.courseName);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, token]);

  if (loading) return <p>Loading enrolled students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Students Enrolled in {courseName}</h2>
      {students.length === 0 ? (
        <p>No students enrolled in this course yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Admission No.</th>
              <th>Email</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.fullName}</td>
                <td>{student.admissionNumber}</td>
                <td>{student.email}</td>
                <td>{new Date(student.doB).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default EnrolledStudents;
