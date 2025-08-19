import { Link, Outlet } from 'react-router-dom';

function StudentDashboard() {
  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <h3 style={styles.header}>Student Panel</h3>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="profile" style={styles.link}>Profile</Link>
            </li>
            <li style={styles.navItem}>
              Courses
              <ul style={styles.subNavList}>
                <li><Link to="courses/enrolled" style={styles.link}>Enrolled Courses</Link></li>
                <li><Link to="courses/available" style={styles.link}>Available Courses</Link></li>
              </ul>
            </li>
            <li style={styles.navItem}>
              <Link to="grades" style={styles.link}>Grades</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="attendance" style={styles.link}>Attendance</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#f4f4f4',
    padding: '1rem',
    borderRight: '1px solid #ddd',
  },
  header: {
    marginBottom: '1rem',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  subNavList: {
    listStyle: 'none',
    paddingLeft: '1rem',
    marginTop: '0.5rem',
  },
  navItem: {
    marginBottom: '10px',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#fff',
  },
};

export default StudentDashboard;
