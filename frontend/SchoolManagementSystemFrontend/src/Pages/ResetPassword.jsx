import { useState } from 'react';
import axios from '../API/Axios';

function ResetPassword() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('/auth/reset-password', { username, newPassword });
      setMessage('Password reset successfully. User will be required to change it on next login.');
      setUsername('');
      setNewPassword('');
    } catch (err) {
      const error = err?.response?.data || 'Failed to reset password.';
      setMessage(typeof error === 'string' ? error : 'An error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Reset User Password</h2>
      {message && <p style={{ color: message.startsWith('Failed') ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={handleReset} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="New Temporary Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Reset Password</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ResetPassword;
