import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>SchoolApp</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
      </ul>
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  logo: {
    margin: 0,
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  }
}

export default Navbar
