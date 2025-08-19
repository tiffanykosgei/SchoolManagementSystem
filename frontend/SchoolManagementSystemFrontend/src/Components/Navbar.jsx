import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>
        <Link to="/" style={styles.logoLink}>SchoolApp</Link>
      </h2>

      <ul style={styles.navLinks}>
        {/* 🏠 Home button always goes to homepage */}
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>

        {/* 🔒 Login/Logout */}
        {!token ? (
          <li><Link to="/login" style={styles.link}>Login</Link></li>
        ) : (
          <li>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: '#fff',
  },
  logo: {
    margin: 0,
  },
  logoLink: {
    textDecoration: 'none',
    color: '#ecf0f1',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
