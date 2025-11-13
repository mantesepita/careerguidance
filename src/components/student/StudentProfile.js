// src/components/student/StudentProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDocument, createDocumentWithId, updateDocument } from '../../firebase/helpers';

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'English',
  'Sesotho',
  'Physics',
  'Chemistry',
  'Biology',
  'Agriculture',
  'History',
  'Geography',
  'Development Studies',
  'Computer Science',
  'Accounting',
  'Business Studies',
  'Economics'
];

const GRADE_OPTIONS = ['A*', 'A', 'B', 'C', 'D', 'E', 'F'];

const GRADE_POINTS = {
  'A*': 7,
  'A': 6,
  'B': 5,
  'C': 4,
  'D': 3,
  'E': 2,
  'F': 1
};

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
      points: 0,
      subjects: []
    }
  });

  const [selectedSubjects, setSelectedSubjects] = useState([
    { subject: '', grade: '' }
  ]);

  useEffect(() => {
    loadStudentProfile();
  }, [currentUser]);

  const loadStudentProfile = async () => {
    if (currentUser) {
      const result = await getDocument('students', currentUser.uid);
      if (result.success) {
        setFormData(result.data);
        
        // Load existing subjects
        if (result.data.highSchool?.subjects && result.data.highSchool.subjects.length > 0) {
          setSelectedSubjects(result.data.highSchool.subjects);
        }
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

  const handleSubjectChange = (index, field, value) => {
    const updated = [...selectedSubjects];
    updated[index][field] = value;
    setSelectedSubjects(updated);
    
    // Auto-calculate points
    calculateTotalPoints(updated);
  };

  const addSubject = () => {
    if (selectedSubjects.length < 10) {
      setSelectedSubjects([...selectedSubjects, { subject: '', grade: '' }]);
    }
  };

  const removeSubject = (index) => {
    const updated = selectedSubjects.filter((_, i) => i !== index);
    setSelectedSubjects(updated);
    calculateTotalPoints(updated);
  };

  const calculateTotalPoints = (subjects) => {
    const totalPoints = subjects.reduce((sum, item) => {
      if (item.subject && item.grade) {
        return sum + (GRADE_POINTS[item.grade] || 0);
      }
      return sum;
    }, 0);

    setFormData(prev => ({
      ...prev,
      highSchool: {
        ...prev.highSchool,
        points: totalPoints
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate subjects
      const validSubjects = selectedSubjects.filter(s => s.subject && s.grade);
      
      if (validSubjects.length === 0) {
        setError('Please add at least one subject with a grade');
        setLoading(false);
        return;
      }

      const profileData = {
        ...formData,
        highSchool: {
          ...formData.highSchool,
          graduationYear: parseInt(formData.highSchool.graduationYear),
          subjects: validSubjects
        },
        currentStatus: 'seeking-admission',
        profileCompleted: true
      };

      // Check if profile exists
      const existingProfile = await getDocument('students', currentUser.uid);
      
      let result;
      if (existingProfile.success) {
        result = await updateDocument('students', currentUser.uid, profileData);
      } else {
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
      <h1 style={styles.title}>📋 My Profile</h1>
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

          {/* Subjects & Grades Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Subjects & Grades *</label>
            <small style={styles.helpText}>
              Select your subjects and corresponding grades
            </small>

            {selectedSubjects.map((item, index) => (
              <div key={index} style={styles.subjectRow}>
                <select
                  value={item.subject}
                  onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                  style={styles.subjectSelect}
                  required
                >
                  <option value="">Select Subject</option>
                  {AVAILABLE_SUBJECTS.map(subject => (
                    <option 
                      key={subject} 
                      value={subject}
                      disabled={selectedSubjects.some((s, i) => i !== index && s.subject === subject)}
                    >
                      {subject}
                    </option>
                  ))}
                </select>

                <select
                  value={item.grade}
                  onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                  style={styles.gradeSelect}
                  required
                >
                  <option value="">Grade</option>
                  {GRADE_OPTIONS.map(grade => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>

                <span style={styles.pointsDisplay}>
                  {item.grade ? `${GRADE_POINTS[item.grade]} pts` : '0 pts'}
                </span>

                {selectedSubjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    style={styles.removeButton}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {selectedSubjects.length < 10 && (
              <button
                type="button"
                onClick={addSubject}
                style={styles.addButton}
              >
                + Add Another Subject
              </button>
            )}
          </div>

          {/* Total Points Display */}
          <div style={styles.pointsSummary}>
            <strong>Total Points:</strong>
            <span style={styles.totalPoints}>{formData.highSchool.points}</span>
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
          {loading ? '💾 Saving...' : '💾 Save Profile'}
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
  helpText: {
    color: '#7f8c8d',
    fontSize: '12px',
    marginBottom: '10px',
    display: 'block'
  },
  subjectRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto auto',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center'
  },
  subjectSelect: {
    padding: '10px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  gradeSelect: {
    padding: '10px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  pointsDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#27ae60',
    minWidth: '50px',
    textAlign: 'center'
  },
  removeButton: {
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  pointsSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    marginTop: '20px'
  },
  totalPoints: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#27ae60'
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