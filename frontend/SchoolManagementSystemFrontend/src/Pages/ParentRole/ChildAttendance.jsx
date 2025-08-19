import { useEffect, useState } from 'react';
import axios from '../../API/Axios';

const ChildAttendance = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/Parent/child-attendance')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading attendance...</p>;

  return (
    <div>
      <h2>Child's Attendance</h2>
      <p>Present: {data.presentPercentage}%</p>
      <p>Absent: {data.absentPercentage}%</p>
      <p>Late: {data.latePercentage}%</p>
    </div>
  );
};

export default ChildAttendance;
