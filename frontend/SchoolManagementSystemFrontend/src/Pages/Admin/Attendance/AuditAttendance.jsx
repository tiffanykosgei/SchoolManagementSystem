import { useEffect, useState } from 'react';
import axiosInstance from '../../../API/Axios';

function AuditAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [attendanceRecords, searchTerm]);

 const fetchAttendance = async () => {
  try {
    const res = await axiosInstance.get('/attendance');
    setAttendanceRecords(res.data);
    setFilteredRecords(res.data);
  } catch (error) {
    setError(error?.message || 'Failed to fetch attendance records.');
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (term) => {
    const filtered = attendanceRecords.filter(
      (record) =>
        record.studentId.toLowerCase().includes(term.toLowerCase()) ||
        record.courseId.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRecords(filtered);
    setCurrentPage(1); // reset pagination
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <h2>Audit Attendance</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Student ID or Course ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '5px', marginBottom: '10px' }}
      />

      {/* Feedback */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filteredRecords.length === 0 && <p>No attendance records found.</p>}

      {/* Attendance Table */}
      {!loading && filteredRecords.length > 0 && (
        <>
          <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Course ID</th>
                <th>Status</th>
                <th>Date Recorded</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id || `${record.studentId}-${record.courseId}-${record.dateRecorded}`}>
                  <td>{record.studentId}</td>
                  <td>{record.courseId}</td>
                  <td>{record.status}</td>
                  <td>{new Date(record.dateRecorded).toLocaleString()}</td>
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

export default AuditAttendance;
