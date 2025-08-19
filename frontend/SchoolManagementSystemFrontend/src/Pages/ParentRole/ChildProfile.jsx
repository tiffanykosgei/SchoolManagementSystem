import { useEffect, useState } from 'react';
import axios from '../../API/Axios';

const ChildProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('/api/Parent/child-profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Child's Profile</h2>
      <p><strong>Name:</strong> {profile.fullName}</p>
      <p><strong>Admission #:</strong> {profile.admissionNumber}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Date of Birth:</strong> {profile.doB}</p>
    </div>
  );
};

export default ChildProfile;
