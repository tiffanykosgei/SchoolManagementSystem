import { useEffect, useState } from 'react';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function StudentGrades() {
  const { token } = useAuth();
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get('/api/student/my-grades', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGrades(res.data);
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to fetch grades.';
        setError(message);
      }
    };

    if (token) {
      fetchGrades();
    }
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 My Grades</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {grades.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Course</th>
              <th>Term</th>
              <th>Test 1</th>
              <th>Test 2</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.courseTitle}</td>
                <td>{grade.termGrade ?? '-'}</td>
                <td>{grade.test1 ?? '-'}</td>
                <td>{grade.test2 ?? '-'}</td>
                <td>{grade.finalGrade ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentGrades;
