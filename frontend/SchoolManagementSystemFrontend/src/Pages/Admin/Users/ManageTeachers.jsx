import { useState, useEffect } from 'react';
import axiosInstance from '../../../API/Axios';

function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [teacher, setTeacher] = useState({
    regNo: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    employeeNumber: '',
    userId: '',
    courseId: '',
    courseIds: []
  });

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axiosInstance.get('/Teacher');
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Error fetching teachers.'
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get('/Course');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Error fetching courses.'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindUser = async () => {
    if (!teacher.regNo) {
      setMessage({ type: 'error', text: 'Please enter RegNo first.' });
      return;
    }
    try {
      const res = await axiosInstance.get(`/Auth/by-regno/${teacher.regNo}`);
      setTeacher((prev) => ({
        ...prev,
        userId: res.data.applicationUserId,
        userName: res.data.username,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        phoneNumber: res.data.phoneNumber
      }));
      setMessage({ type: 'success', text: 'User found. Fill in the remaining teacher details.' });
    } catch (error) {
      setMessage({ type: 'error', text: error?.response?.data || 'User not found.' });
    }
  };

  const validateForm = () => {
    const { regNo, employeeNumber, phoneNumber, userId } = teacher;
    if (!regNo || !employeeNumber || !phoneNumber || !userId) {
      setMessage({
        type: 'error',
        text: 'RegNo, Employee Number, Phone Number are required. Lookup RegNo first.'
      });
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        regNo: teacher.regNo,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employeeNumber: teacher.employeeNumber,
        phoneNumber: teacher.phoneNumber,
        courseId: teacher.courseId ? parseInt(teacher.courseId) : 0,
        userName: teacher.userName,
        userId: teacher.userId,
        courseIds: teacher.courseId ? [parseInt(teacher.courseId)] : []
      };

      const res = await axiosInstance.post('/Teacher/create', payload);
      const teacherId = res.data.teacherId;

      const selectedCourse = courses.find(c => c.courseId === teacher.courseId);
      const newTeacher = {
        ...payload,
        teacherId,
        courses: selectedCourse ? [selectedCourse] : []
      };

      setTeachers(prev => [...prev, newTeacher]);
      setMessage({ type: 'success', text: 'Teacher created successfully.' });
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data || 'Error creating teacher.'
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedId || !validateForm()) return;

    try {
      const payload = {
        regNo: teacher.regNo,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employeeNumber: teacher.employeeNumber,
        phoneNumber: teacher.phoneNumber,
        courseId: teacher.courseId ? parseInt(teacher.courseId) : 0,
        userName: teacher.userName,
        userId: teacher.userId,
        courseIds: teacher.courseId ? [parseInt(teacher.courseId)] : []
      };

      await axiosInstance.put(`/Teacher/${selectedId}`, payload);
      setMessage({ type: 'success', text: 'Teacher updated successfully.' });
      resetForm();
      fetchTeachers();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data || 'Error updating teacher.'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await axiosInstance.delete(`/Teacher/${selectedId}`);
      setMessage({ type: 'success', text: 'Teacher deleted successfully.' });
      setTeachers(prev => prev.filter(t => t.teacherId !== selectedId));
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data || 'Error deleting teacher.'
      });
    }
  };

  const handleEdit = (t) => {
    setTeacher({
      regNo: t.regNo || '',
      firstName: t.firstName || '',
      lastName: t.lastName || '',
      userName: t.username || '',
      email: t.email || '',
      phoneNumber: t.phoneNumber || '',
      employeeNumber: t.employeeNumber || '',
      userId: t.userId || '',
      courseId: t.courses?.[0]?.courseId || '',
      courseIds: t.courses?.map(c => c.courseId) || []
    });
    setSelectedId(t.teacherId);
    setMessage({ type: '', text: '' });
  };

  const resetForm = () => {
    setTeacher({
      regNo: '',
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      employeeNumber: '',
      userId: '',
      courseId: '',
      courseIds: []
    });
    setSelectedId(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <h2>Manage Teachers</h2>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>
      )}

      <input name="regNo" placeholder="Reg No" value={teacher.regNo} onChange={handleChange} disabled={selectedId !== null} />
      <button type="button" onClick={handleFindUser} disabled={selectedId !== null}>Find User by RegNo</button>

      <input name="firstName" placeholder="First Name" value={teacher.firstName} onChange={handleChange} disabled />
      <input name="lastName" placeholder="Last Name" value={teacher.lastName} onChange={handleChange} disabled />
      <input name="userName" placeholder="Username" value={teacher.userName} onChange={handleChange} disabled />
      <input name="email" placeholder="Email" value={teacher.email} onChange={handleChange} disabled />
      <input name="phoneNumber" placeholder="Phone Number" value={teacher.phoneNumber} onChange={handleChange} />

      <input name="employeeNumber" placeholder="Employee Number" value={teacher.employeeNumber} onChange={handleChange} />

      <div>
        <label>Assign Course</label><br />
        <select name="courseId" value={teacher.courseId} onChange={handleChange}>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleCreate} disabled={selectedId !== null}>Create</button>
        <button onClick={handleUpdate} disabled={!selectedId}>Update</button>
        <button onClick={handleDelete} disabled={!selectedId}>Delete</button>
        <button onClick={resetForm}>Clear</button>
      </div>

      <h3>All Teachers</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>RegNo</th>
            <th>First</th>
            <th>Last</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Employee No.</th>
            <th>Assigned Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.teacherId}>
              <td>{t.regNo}</td>
              <td>{t.firstName}</td>
              <td>{t.lastName}</td>
              <td>{t.userName}</td>
              <td>{t.email}</td>
              <td>{t.phoneNumber}</td>
              <td>{t.employeeNumber}</td>
              <td>{t.courses?.map(c => c.courseName).join(', ')}</td>
              <td><button onClick={() => handleEdit(t)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTeachers;
