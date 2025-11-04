// src/components/student/StudentProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDocument, createDocumentWithId, updateDocument } from '../../firebase/helpers';

const StudentProfile = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    highSchool: {
      name: '',
      graduationYear: '',
      points: '',
      subjects: ''
    }
  });

  useEffect(() => {
    loadStudentProfile();
  }, [currentUser]);

  const loadStudentProfile = async () => {
    if (currentUser) {
      const result = await getDocument('students', currentUser.uid);
      if (result.success) {
        setFormData(result.data);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse subjects string into array
      const subjectsArray = formData.highSchool.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const profileData = {
        ...formData,
        highSchool: {
          ...formData.highSchool,
          points: parseInt(formData.highSchool.points),
          graduationYear: parseInt(formData.highSchool.graduationYear),
          subjects: subjectsArray
        },
        currentStatus: 'seeking-admission',
        profileCompleted: true
      };

      // Check if profile exists
      const existingProfile = await getDocument('students', currentUser.uid);
      
      let result;
      if (existingProfile.success) {
        // Update existing profile
        result = await updateDocument('students', currentUser.uid, profileData);
      } else {
        // Create new profile
        result = await createDocumentWithId('students', currentUser.uid, profileData);
      }

      if (result.success) {
        setSuccess('✅ Profile saved successfully!');
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
      <h1 style={styles.title}> My Profile</h1>
      <p style={styles.subtitle}>Complete your profile to start applying for courses</p>

      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter first name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ID Number *</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter ID number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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
                placeholder="+266-5800-0000"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Emergency Contact</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Name *</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter contact name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Relationship *</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., Mother, Father"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Phone *</label>
            <input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="+266-5800-0000"
            />
          </div>
        </div>

        {/* High School Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>High School Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>High School Name *</label>
              <input
                type="text"
                name="highSchool.name"
                value={formData.highSchool.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter high school name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Graduation Year *</label>
              <input
                type="number"
                name="highSchool.graduationYear"
                value={formData.highSchool.graduationYear}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., 2023"
                min="1990"
                max="2030"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Total Points *</label>
            <input
              type="number"
              name="highSchool.points"
              value={formData.highSchool.points}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter total points (0-50)"
              min="0"
              max="50"
            />
            <small style={styles.helpText}>Your total high school points</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subjects & Grades *</label>
            <textarea
              name="highSchool.subjects"
              value={formData.highSchool.subjects}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Enter subjects and grades separated by commas&#10;Example: Mathematics: A, English: B, Physics: C"
              rows="4"
            />
            <small style={styles.helpText}>Separate each subject with a comma</small>
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
          {loading ? 's Saving...' : ' Save Profile'}
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
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer'
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
  helpText: {
    color: '#7f8c8d',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block'
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
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px'
  }
};

export default StudentProfile;