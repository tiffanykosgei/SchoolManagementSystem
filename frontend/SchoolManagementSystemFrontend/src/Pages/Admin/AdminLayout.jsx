import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Panel</h2>
        <ul style={styles.navList}>
          <li><NavLink to="register-user" style={getLinkStyle}>Register User</NavLink></li>
          <li><NavLink to="teachers" style={getLinkStyle}>Manage Teachers</NavLink></li>
          <li><NavLink to="students" style={getLinkStyle}>Manage Students</NavLink></li>
          <li><NavLink to="parents" style={getLinkStyle}>Manage Parents</NavLink></li>
          <li><NavLink to="courses" style={getLinkStyle}>Manage Courses</NavLink></li>
          <li><NavLink to="grades" style={getLinkStyle}>View Grades</NavLink></li>
          <li><NavLink to="attendance-audit" style={getLinkStyle}>Audit Attendance</NavLink></li>
        </ul>
      </aside>

      {/* Page Content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden', // Prevent scrolling
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '30px',
    fontSize: '20px',
    borderBottom: '1px solid #7f8c8d',
    paddingBottom: '10px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
};

const getLinkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 0',
  color: isActive ? '#1abc9c' : '#ecf0f1',
  textDecoration: 'none',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: '0.2s ease',
  backgroundColor: isActive ? '#34495e' : 'transparent',
});

export default AdminLayout;
