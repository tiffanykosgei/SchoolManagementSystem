import { useState } from 'react';
import axios from '../../API/Axios';
import SearchFilter from '../../Components/SearchFilter';
import jsPDF from 'jspdf';

const Reports = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async (filters) => {
    setLoading(true);
    try {
      const response = await axios.get('/reports', {
        params: filters,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text('School Report', 10, 10);

    let y = 20;
    results.forEach((entry, index) => {
      doc.text(
        `${index + 1}. ${entry.studentName} - ${entry.courseTitle} - Grade: ${entry.grade} - Attendance: ${entry.attendanceStatus} - Date: ${new Date(entry.date).toLocaleDateString()}`,
        10,
        y
      );
      y += 10;
    });

    doc.save('report.pdf');
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Reports</h2>
      <SearchFilter onFilter={fetchReports} />

      {results.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={exportAsPDF}>Export as PDF</button>
          <button onClick={exportAsJSON} style={{ marginLeft: '10px' }}>
            Export as JSON
          </button>
        </div>
      )}

      {loading && <p>Loading reports...</p>}

      {!loading && results.length === 0 && <p>No data found.</p>}

      {!loading && results.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Grade</th>
              <th>Attendance</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((entry, index) => (
              <tr key={index}>
                <td>{entry.studentName}</td>
                <td>{entry.courseTitle}</td>
                <td>{entry.grade}</td>
                <td>{entry.attendanceStatus}</td>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
