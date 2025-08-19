import { useEffect, useState } from 'react';
import axiosInstance from '../../../API/Axios';

function ViewGrades() {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const gradesPerPage = 5;

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [grades, searchTerm]);

 const fetchGrades = async () => {
  try {
    const response = await axiosInstance.get('/grades');
    setGrades(response.data);
    setFilteredGrades(response.data);
  } catch (error) {
    const errorMessage = error?.message || 'Failed to fetch grades. Please try again.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (term) => {
    const filtered = grades.filter(
      (grade) =>
        grade.studentId.toLowerCase().includes(term.toLowerCase()) ||
        grade.courseId.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGrades(filtered);
    setCurrentPage(1); // Reset pagination when search changes
  };

  // Pagination logic
  const indexOfLastGrade = currentPage * gradesPerPage;
  const indexOfFirstGrade = indexOfLastGrade - gradesPerPage;
  const currentGrades = filteredGrades.slice(indexOfFirstGrade, indexOfLastGrade);
  const totalPages = Math.ceil(filteredGrades.length / gradesPerPage);

  const paginate = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <h2>📊 All Grades</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Student ID or Course ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      />

      {/* Feedback */}
      {loading && <p>Loading grades...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filteredGrades.length === 0 && <p>No grades found.</p>}

      {/* Grade List */}
      {!loading && filteredGrades.length > 0 && (
        <>
          <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Course ID</th>
                <th>Grade</th>
                <th>Date Recorded</th>
              </tr>
            </thead>
            <tbody>
              {currentGrades.map((grade) => (
                <tr key={grade.id || `${grade.studentId}-${grade.courseId}`}>
                  <td>{grade.studentId}</td>
                  <td>{grade.courseId}</td>
                  <td>{grade.gradeAwarded}</td>
                  <td>{new Date(grade.dateRecorded).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => paginate('prev')} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => paginate('next')} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewGrades;
