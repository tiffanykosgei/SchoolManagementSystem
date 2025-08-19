import { useEffect, useState } from 'react';
import axios from '../../API/Axios';

const ChildGrades = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    axios.get('/api/Parent/child-grades')
      .then(res => setGrades(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Child's Grades</h2>
      {grades.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Test 1</th>
              <th>Test 2</th>
              <th>Final Grade</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i}>
                <td>{g.courseName}</td>
                <td>{g.test1}</td>
                <td>{g.test2}</td>
                <td>{g.finalGrade}</td>
                <td>{g.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChildGrades;
