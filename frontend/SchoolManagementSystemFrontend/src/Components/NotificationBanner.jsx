import { useEffect, useState } from 'react';

function NotificationBanner({ message, type = 'info', duration = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const styles = {
    wrapper: {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      backgroundColor: type === 'error' ? '#e74c3c' : '#3498db',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }
  };

  return (
    <div style={styles.wrapper}>
      {message}
    </div>
  );
}

export default NotificationBanner;
