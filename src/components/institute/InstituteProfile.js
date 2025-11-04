// src/components/institute/InstituteProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDocument, createDocumentWithId, updateDocument } from '../../firebase/helpers';

const InstituteProfile = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    loadInstitutionProfile();
  }, [currentUser]);

  const loadInstitutionProfile = async () => {
    if (currentUser) {
      const result = await getDocument('institutions', currentUser.uid);
      if (result.success) {
        setFormData(result.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        ...formData,
        userId: currentUser.uid
      };

      // Check if profile exists
      const existingProfile = await getDocument('institutions', currentUser.uid);
      
      let result;
      if (existingProfile.success) {
        // Update existing profile
        result = await updateDocument('institutions', currentUser.uid, profileData);
      } else {
        // Create new profile
        result = await createDocumentWithId('institutions', currentUser.uid, profileData);
      }

      if (result.success) {
        setSuccess('✅ Institution profile saved successfully!');
        refreshData();
        window.scrollTo(0, 0);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Institution Profile</h1>
      <p style={styles.subtitle}>Complete your institution information</p>

      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {formData.status === 'pending' && (
        <div style={styles.warningAlert}>
          <strong> Pending Approval</strong>
          <p>Your institution is pending admin approval. You can still complete your profile.</p>
        </div>
      )}

      {formData.status === 'active' && (
        <div style={styles.successAlert}>
          <strong>✅ Active</strong>
          <p>Your institution is approved and active.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Institution Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., National University of Lesotho"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Acronym *</label>
              <input
                type="text"
                name="acronym"
                value={formData.acronym}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., NUL"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Brief description of your institution"
              rows="4"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="info@institution.ls"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="+266-XXXX-XXXX"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Physical Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Full physical address"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://www.institution.ls"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.submitButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Saving...' : ' Save Profile'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px'
  },
  successAlert: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  warningAlert: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ffc107'
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '35px',
    paddingBottom: '35px',
    borderBottom: '1px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#2c3e50',
    fontWeight: '600'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default InstituteProfile;