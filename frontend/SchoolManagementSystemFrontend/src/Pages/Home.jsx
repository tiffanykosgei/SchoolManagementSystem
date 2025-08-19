function Home() {
  return (
    <div style={styles.mainContent}>
      <h1>Welcome to the School Management System</h1>
      <p>This system manages students, teachers, parents, courses, grades, and attendance.</p>
    </div>
  );
}

const styles = {
  mainContent: {
    padding: '100px',
    textAlign: 'center',
  },
};

export default Home;
