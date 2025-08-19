import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../API/Axios';
import { useAuth } from '../../Contexts/AuthContext';

function ManageGrades() {
  const { courseId } = useParams();
  const { token } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [term, setTerm] = useState('');
  const [test1, setTest1] = useState('');
  const [test2, setTest2] = useState('');
  const [finalGrade, setFinalGrade] = useState('');
  const [grades, setGrades] = useState([]);
  const [editGradeId, setEditGradeId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudentsAndGrades = async () => {
      try {
        const res = await axios.get(`/api/Grade/my-course-grades?courseId=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data.students || []);
        setGrades(res.data.grades || []);
      } catch (err) {
        console.error('Error loading data', err);
      }
    };
    fetchStudentsAndGrades();
  }, [courseId, token]);

  const resetForm = () => {
    setSelectedStudentId('');
    setTerm('');
    setTest1('');
    setTest2('');
    setFinalGrade('');
    setEditGradeId(null);
  };

  const handleAssign = async () => {
    if (!selectedStudentId || !term || !test1 || !test2 || !finalGrade) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('/api/Grade/assign', {
        studentId: selectedStudentId,
        courseId: parseInt(courseId),
        term,
        test1: parseFloat(test1),
        test2: parseFloat(test2),
        final: parseFloat(finalGrade)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Grade assigned successfully!');
      resetForm();
    } catch (err) {
      setMessage('Error assigning grade.');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editGradeId) return;

    try {
      await axios.put(`/api/Grade/update/${editGradeId}`, {
        studentId: selectedStudentId,
        courseId: parseInt(courseId),
        term,
        test1: parseFloat(test1),
        test2: parseFloat(test2),
        final: parseFloat(finalGrade)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Grade updated!');
      resetForm();
    } catch (err) {
      setMessage('Error updating grade.');
      console.error(err);
    }
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;

    try {
      await axios.delete(`/api/Grade/delete/${gradeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Grade deleted.');
    } catch (err) {
      setMessage('Error deleting grade.');
      console.error(err);
    }
  };

  const startEdit = (grade) => {
    setSelectedStudentId(grade.studentId);
    setTerm(grade.term);
    setTest1(grade.test1);
    setTest2(grade.test2);
    setFinalGrade(grade.final);
    setEditGradeId(grade.gradeId);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Grades for Course #{courseId}</h2>

      {message && <p style={{ color: 'blue' }}>{message}</p>}

      <div>
        <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.studentId} value={student.studentId}>
              {student.fullName} ({student.admissionNumber})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Test 1"
          value={test1}
          onChange={(e) => setTest1(e.target.value)}
        />
        <input
          type="number"
          placeholder="Test 2"
          value={test2}
          onChange={(e) => setTest2(e.target.value)}
        />
        <input
          type="number"
          placeholder="Final"
          value={finalGrade}
          onChange={(e) => setFinalGrade(e.target.value)}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        {editGradeId ? (
          <button onClick={handleUpdate}>Update Grade</button>
        ) : (
          <button onClick={handleAssign}>Assign Grade</button>
        )}
        <button onClick={resetForm} style={{ marginLeft: '10px' }}>Clear</button>
      </div>

      <hr />

      <h3>Existing Grades</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Student</th>
            <th>Term</th>
            <th>Test 1</th>
            <th>Test 2</th>
            <th>Final</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades
            .filter(g => g.courseId === parseInt(courseId))
            .map(grade => (
              <tr key={grade.gradeId}>
                <td>{grade.studentName}</td>
                <td>{grade.term}</td>
                <td>{grade.test1}</td>
                <td>{grade.test2}</td>
                <td>{grade.final}</td>
                <td>
                  <button onClick={() => startEdit(grade)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(grade.gradeId)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageGrades;
