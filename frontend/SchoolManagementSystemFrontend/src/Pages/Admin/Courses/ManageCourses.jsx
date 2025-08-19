import { useState, useEffect } from 'react';
import axiosInstance from '../../../API/Axios';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [course, setCourse] = useState({
    courseName: '',
    courseDescription: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get('/Course');
      const data = res.data;

      // ✅ Fix: unwrap $values
      const actualArray = Array.isArray(data) ? data : data?.$values;

      if (Array.isArray(actualArray)) {
        setCourses(actualArray);
      } else {
        console.warn('Expected array or $values but got:', data);
        setCourses([]);
        setMessage({ type: 'error', text: 'Invalid courses data from server.' });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Error fetching courses.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!course.courseName.trim()) {
      setMessage({ type: 'error', text: 'Course Name is required.' });
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await axiosInstance.post('/Course', course);
      setMessage({ type: 'success', text: 'Course created successfully.' });
      resetForm();
      fetchCourses();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Error creating course.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleUpdate = async () => {
    if (!selectedId || !validateForm()) return;

    try {
      await axiosInstance.put(`/Course/${selectedId}`, course);
      setMessage({ type: 'success', text: 'Course updated successfully.' });
      resetForm();
      fetchCourses();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Error updating course.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/Course/${selectedId}`);
      setMessage({ type: 'success', text: 'Course deleted successfully.' });
      resetForm();
      fetchCourses();
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Error deleting course.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleEdit = (c) => {
    setCourse({
      courseName: c.courseName,
      courseDescription: c.courseDescription
    });
    setSelectedId(c.courseId);
    setMessage({ type: '', text: '' });
  };

  const resetForm = () => {
    setCourse({
      courseName: '',
      courseDescription: ''
    });
    setSelectedId(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <h2>Manage Courses</h2>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}

      <input
        name="courseName"
        placeholder="Course Name"
        value={course.courseName}
        onChange={handleChange}
      />
      <input
        name="courseDescription"
        placeholder="Course Description"
        value={course.courseDescription}
        onChange={handleChange}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleCreate} disabled={selectedId !== null}>Create</button>
        <button onClick={handleUpdate} disabled={!selectedId}>Update</button>
        <button onClick={handleDelete} disabled={!selectedId}>Delete</button>
        <button onClick={resetForm}>Clear</button>
      </div>

      <h3>All Courses</h3>
      {Array.isArray(courses) && courses.length > 0 ? (
        <ul>
          {courses.map((c) => (
            <li key={c.courseId}>
              <strong>{c.courseName}</strong>: {c.courseDescription}
              <button onClick={() => handleEdit(c)} style={{ marginLeft: '10px' }}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default ManageCourses;
