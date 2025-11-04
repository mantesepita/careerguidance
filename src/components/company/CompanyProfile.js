// src/components/company/CompanyProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createDocument, updateDocument, getDocument } from '../../firebase/helpers';

const CompanyProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    contactEmail: '',
    website: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getDocument('companies', currentUser.uid);
    if (result.success && result.data) {
      setProfile(result.data);
      setFormData(result.data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = { ...formData, userId: currentUser.uid };

    let result;
    if (profile) {
      result = await updateDocument('companies', currentUser.uid, data);
    } else {
      // use createDocumentWithId if available, else createDocument
      result = await createDocument('companies', { ...data, id: currentUser.uid });
    }

    if (result.success) {
      setMessage('✅ Profile saved successfully!');
      loadProfile();
    } else {
      setMessage(' Error saving profile.');
    }
  };

  if (loading) return <p style={styles.loading}>Loading company profile...</p>;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}> Company Profile</h2>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} required style={styles.input}/>
        <input name="industry" placeholder="Industry" value={formData.industry} onChange={handleChange} style={styles.input}/>
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} style={styles.input}/>
        <input name="contactEmail" placeholder="Contact Email" value={formData.contactEmail} onChange={handleChange} style={styles.input}/>
        <input name="website" placeholder="Website" value={formData.website} onChange={handleChange} style={styles.input}/>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={styles.textarea}/>
        <button type="submit" style={styles.button}> Save Profile</button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: { fontSize: '24px', marginBottom: '15px', color: '#2c3e50' },
  message: { marginBottom: '10px', color: '#27ae60' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px'
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    minHeight: '100px'
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  loading: { textAlign: 'center', color: '#555' }
};

export default CompanyProfile;
