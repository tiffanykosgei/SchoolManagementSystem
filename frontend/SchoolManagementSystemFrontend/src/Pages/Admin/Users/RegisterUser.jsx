import { useState, useEffect } from 'react';
import axiosInstance from '../../../API/Axios';

function RegisterUser() {
  const [user, setUser] = useState({
    regNo: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ✅ Fetch all users when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/Auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { regNo, firstName, lastName, username, email, phoneNumber, password, role } = user;
    if (!regNo || !firstName || !lastName || !username || !email || !phoneNumber || (!selectedUserId && !password) || !role) {
      setMessage({ type: 'error', text: 'All fields are required (password is required only when registering).' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        regNo: user.regNo,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        role: user.role
      };

      await axiosInstance.post('/Auth/register-user', payload);

      setMessage({ type: 'success', text: 'User registered successfully.' });
      fetchUsers();
      resetForm();
    } catch (error) {
      const msg = error?.response?.data?.title || error?.response?.data?.message || 'Error registering user.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUserId) return;
    if (!validateForm()) return;

    try {
      const payload = {
        regNo: user.regNo,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      };

      await axiosInstance.put(`/Auth/update-user/${selectedUserId}`, payload);

      setMessage({ type: 'success', text: 'User updated successfully.' });
      fetchUsers();
      resetForm();
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data || 'Error updating user.' });
    }
  };

  const handleSelectUser = (u) => {
    setUser({
      regNo: u.regNo,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.userName,
      email: u.email,
      phoneNumber: u.phoneNumber,
      password: '', // Don’t fill password
      role: '' // Optional: your API may not return role
    });
    setSelectedUserId(u.id);
    setMessage({ type: '', text: '' });
  };

  const resetForm = () => {
    setUser({
      regNo: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: ''
    });
    setSelectedUserId(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <div>
      <h2>Register New User (Admin Only)</h2>

      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          name="regNo"
          placeholder="Registration Number"
          value={user.regNo}
          onChange={handleChange}
        />

        <input
          name="firstName"
          placeholder="First Name"
          value={user.firstName}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={user.lastName}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={user.email}
          onChange={handleChange}
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Temporary Password"
          type="password"
          value={user.password}
          onChange={handleChange}
          disabled={selectedUserId !== null}
        />

        <select name="role" value={user.role} onChange={handleChange}>
          <option value="">-- Select Role --</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
          <option value="Parent">Parent</option>
        </select>

        <div style={{ marginTop: '10px' }}>
          <button
            type="submit"
            disabled={loading || selectedUserId !== null}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!selectedUserId}
            style={{ marginLeft: '10px' }}
          >
            Update User
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: '10px' }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* ✅ Registered Users Table */}
      {users.length > 0 && (
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>RegNo</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} onClick={() => handleSelectUser(u)} style={{ cursor: 'pointer' }}>
                <td>{u.regNo}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.userName}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td>Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RegisterUser;
