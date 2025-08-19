import { useState } from 'react';
import axios from '../../API/Axios';

const MessageStaff = () => {
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const sendMessage = async () => {
    try {
      await axios.post('/api/Parent/message-staff', { message });
      setFeedback('Message sent successfully');
      setMessage('');
    } catch {
      setFeedback('Failed to send message');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Message Staff</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        cols={50}
        placeholder="Type your message here..."
        style={styles.textarea}
      />
      <br />
      <button onClick={sendMessage} style={styles.button}>Send</button>
      {feedback && <p style={styles.feedback}>{feedback}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    marginBottom: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem'
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  feedback: {
    marginTop: '1rem',
    color: '#333'
  }
};

export default MessageStaff;
