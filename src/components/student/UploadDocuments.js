// src/components/student/UploadDocuments.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDocument, updateDocument, uploadFile } from '../../firebase/helpers';

const UploadDocuments = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    graduated: false,
    graduationDate: '',
    cgpa: '',
    transcript: null,
    certificates: [],
    skills: '',
    workExperience: []
  });

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    setLoading(true);
    const result = await getDocument('students', currentUser.uid);
    if (result.success) {
      setStudentData(result.data);
      if (result.data.graduationInfo) {
        setFormData({
          graduated: result.data.graduationInfo.graduated || false,
          graduationDate: result.data.graduationInfo.graduationDate || '',
          cgpa: result.data.graduationInfo.cgpa || '',
          transcript: null,
          certificates: [],
          skills: result.data.skills?.join(', ') || '',
          workExperience: result.data.workExperience || []
        });
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      let transcriptUrl = studentData?.graduationInfo?.transcript || null;
      
      // Upload transcript if selected
      if (formData.transcript) {
        const transcriptResult = await uploadFile(
          formData.transcript,
          `transcripts/${currentUser.uid}/${Date.now()}_${formData.transcript.name}`
        );
        
        if (transcriptResult.success) {
          transcriptUrl = transcriptResult.url;
        } else {
          throw new Error('Failed to upload transcript');
        }
      }

      // Parse skills
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      // Update student document
      const updateData = {
        graduationInfo: {
          graduated: formData.graduated,
          graduationDate: formData.graduationDate,
          cgpa: parseFloat(formData.cgpa),
          transcript: transcriptUrl,
          certificates: [] // Can be extended for multiple certificates
        },
        skills: skillsArray,
        workExperience: formData.workExperience,
        currentStatus: formData.graduated ? 'graduated' : studentData?.currentStatus
      };

      const result = await updateDocument('students', currentUser.uid, updateData);

      if (result.success) {
        setMessage({ type: 'success', text: '✅ Documents uploaded successfully!' });
        refreshData();
        await loadStudentData();
        window.scrollTo(0, 0);
      } else {
        setMessage({ type: 'error', text: `❌ ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Failed to upload: ${error.message}` });
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Upload Documents</h1>
      <p style={styles.subtitle}>Upload your academic transcripts and additional certificates</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Graduation Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Graduation Status</h2>
          
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="graduated"
                checked={formData.graduated}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>I have graduated from my program</span>
            </label>
          </div>

          {formData.graduated && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Graduation Date *</label>
                  <input
                    type="date"
                    name="graduationDate"
                    value={formData.graduationDate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>CGPA / Overall Grade *</label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    max="4.0"
                    style={styles.input}
                    placeholder="e.g., 3.5"
                  />
                  <small style={styles.helpText}>Enter your CGPA out of 4.0</small>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Academic Transcript *</label>
                <input
                  type="file"
                  name="transcript"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={styles.fileInput}
                  required={!studentData?.graduationInfo?.transcript}
                />
                <small style={styles.helpText}>
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </small>
                {studentData?.graduationInfo?.transcript && (
                  <div style={styles.currentFile}>
                     Current transcript uploaded
                    <a 
                      href={studentData.graduationInfo.transcript} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.viewLink}
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills & Competencies</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Technical Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter your skills separated by commas&#10;Example: JavaScript, React, Node.js, Python, SQL"
              rows="4"
            />
            <small style={styles.helpText}>
              List your technical and professional skills (comma-separated)
            </small>
          </div>
        </div>

        {/* Work Experience */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Work Experience (Optional)</h2>
          
          {formData.workExperience.length > 0 && (
            <div style={styles.experienceList}>
              {formData.workExperience.map((exp, index) => (
                <div key={index} style={styles.experienceCard}>
                  <h4 style={styles.experienceTitle}>{exp.position}</h4>
                  <p style={styles.experienceCompany}>{exp.company}</p>
                  <p style={styles.experienceDuration}>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p style={styles.experienceDesc}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          <div style={styles.infoBox}>
            <p> Work experience helps match you with relevant job opportunities</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          style={{
            ...styles.submitButton,
            opacity: uploading ? 0.7 : 1,
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? ' Uploading...' : ' Save Documents'}
        </button>
      </form>

      {/* Document Status Card */}
      {studentData?.graduationInfo?.graduated && (
        <div style={styles.statusCard}>
          <h3 style={styles.statusTitle}> Your Profile Status</h3>
          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.graduationInfo.transcript ? '✅' : '❌'}
              </span>
              <span>Transcript Uploaded</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.skills?.length > 0 ? '✅' : '❌'}
              </span>
              <span>Skills Added</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.workExperience?.length > 0 ? '✅' : '❌'}
              </span>
              <span>Work Experience</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.graduationInfo.cgpa >= 3.0 ? '✅' : '⚠️'}
              </span>
              <span>CGPA: {studentData.graduationInfo.cgpa}</span>
            </div>
          </div>
          <p style={styles.statusNote}>
            {studentData.graduationInfo.transcript && studentData.skills?.length > 0
              ? ' Your profile is complete! You can now apply for jobs.'
              : ' Complete all sections to maximize your job opportunities.'}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px'
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
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
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '2px dashed #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  helpText: {
    color: '#7f8c8d',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block'
  },
  checkboxGroup: {
    marginBottom: '20px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    color: '#2c3e50',
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  currentFile: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewLink: {
    color: '#155724',
    fontWeight: '600',
    textDecoration: 'underline'
  },
  experienceList: {
    marginBottom: '20px'
  },
  experienceCard: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  experienceTitle: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#2c3e50'
  },
  experienceCompany: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    color: '#555',
    fontWeight: '600'
  },
  experienceDuration: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    color: '#7f8c8d'
  },
  experienceDesc: {
    margin: 0,
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.5'
  },
  infoBox: {
    padding: '15px',
    backgroundColor: '#e7f3ff',
    borderRadius: '8px',
    border: '1px solid #b3d9ff'
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
    marginTop: '10px'
  },
  statusCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  statusTitle: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#2c3e50'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  statusIcon: {
    fontSize: '24px',
    marginRight: '10px'
  },
  statusNote: {
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    margin: 0,
    textAlign: 'center',
    fontSize: '14px'
  }
};

export default UploadDocuments;