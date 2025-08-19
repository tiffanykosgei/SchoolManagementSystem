import { useState } from 'react';
import axios from '../API/Axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../Contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setToken, setRole } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/login', { username, password });
      const { token, role, mustChangePassword } = response.data;

      const decoded = jwtDecode(token);
      const extractedRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || role;

      // Store token and role
      setToken(token);
      setRole(extractedRole);
      localStorage.setItem('token', token);
      localStorage.setItem('role', extractedRole);

      if (mustChangePassword) {
        navigate('/change-password');
        return;
      }

      // Role-based dashboard routing
      switch (extractedRole) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Teacher':
          navigate('/teacher');
          break;
        case 'Student':
          navigate('/student');
          break;
        case 'Parent':
          navigate('/parent');
          break;
        default:
          setError('Unknown role. Please contact support.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const message = err?.response?.data || 'Invalid credentials or network error.';
      setError(typeof message === 'string' ? message : 'Login failed. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#ecf0f1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    width: '320px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default Login;
