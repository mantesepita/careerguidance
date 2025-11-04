// src/components/student/BrowseCourses.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllDocuments, 
  queryDocuments, 
  createDocument, 
  canStudentApply 
} from '../../firebase/helpers';

const BrowseCourses = ({ studentData }) => {
  const { currentUser } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    if (selectedInstitution) {
      loadCourses(selectedInstitution);
    } else {
      setCourses([]);
    }
  }, [selectedInstitution]);

  const loadInstitutions = async () => {
    setLoading(true);
    const result = await queryDocuments('institutions', [
      { field: 'status', operator: '==', value: 'active' }
    ]);
    
    if (result.success) {
      setInstitutions(result.data);
    }
    setLoading(false);
  };

  const loadCourses = async (institutionId) => {
    const result = await queryDocuments('courses', [
      { field: 'institutionId', operator: '==', value: institutionId },
      { field: 'admissionStatus', operator: '==', value: 'open' }
    ]);
    
    if (result.success) {
      setCourses(result.data);
    }
  };

  const checkEligibility = (course) => {
    if (!studentData || !studentData.highSchool) {
      return { eligible: false, reason: 'Please complete your profile first' };
    }

    const studentPoints = studentData.highSchool.points;
    const requiredPoints = course.requirements.minimumPoints;

    if (studentPoints < requiredPoints) {
      return { 
        eligible: false, 
        reason: `Insufficient points. Required: ${requiredPoints}, You have: ${studentPoints}` 
      };
    }

    return { eligible: true };
  };

  const handleApply = async (course) => {
    setMessage({ type: '', text: '' });

    // Check if profile is complete
    if (!studentData || !studentData.firstName) {
      setMessage({ 
        type: 'error', 
        text: ' Please complete your profile before applying' 
      });
      return;
    }

    // Check eligibility
    const eligibility = checkEligibility(course);
    if (!eligibility.eligible) {
      setMessage({ type: 'error', text: ` ${eligibility.reason}` });
      return;
    }

    // Check application limit
    const canApply = await canStudentApply(currentUser.uid, course.institutionId);
    if (!canApply) {
      setMessage({ 
        type: 'error', 
        text: ' You have reached the maximum of 2 applications for this institution' 
      });
      return;
    }

    setApplying(true);

    try {
      const applicationData = {
        studentId: currentUser.uid,
        institutionId: course.institutionId,
        courseId: course.id,
        status: 'pending',
        applicationDate: new Date().toISOString(),
        qualifications: {
          points: studentData.highSchool.points,
          subjects: studentData.highSchool.subjects,
          overallGrade: 'B+' // Can be calculated based on points
        }
      };

      const result = await createDocument('applications', applicationData);

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Application submitted successfully!' 
        });
        window.scrollTo(0, 0);
      } else {
        setMessage({ type: 'error', text: `❌ ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to submit application' });
    }

    setApplying(false);
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
      <h1 style={styles.title}> Browse Courses</h1>
      <p style={styles.subtitle}>Find and apply to courses that match your qualifications</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {!studentData?.firstName && (
        <div style={styles.warningAlert}>
          <strong> Profile Incomplete</strong>
          <p>Please complete your profile before applying to courses.</p>
        </div>
      )}

      {/* Institution Selector */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Select Institution:</label>
        <select
          value={selectedInstitution}
          onChange={(e) => setSelectedInstitution(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">-- Select an Institution --</option>
          {institutions.map(inst => (
            <option key={inst.id} value={inst.id}>
              {inst.name} ({inst.acronym})
            </option>
          ))}
        </select>
      </div>

      {/* Courses List */}
      {selectedInstitution && courses.length === 0 && (
        <div style={styles.noCoursesCard}>
          <h3>No courses available</h3>
          <p>This institution has no open admissions at the moment.</p>
        </div>
      )}

      <div style={styles.coursesGrid}>
        {courses.map(course => {
          const eligibility = checkEligibility(course);
          
          return (
            <div key={course.id} style={styles.courseCard}>
              <div style={styles.courseHeader}>
                <h3 style={styles.courseName}>{course.courseName}</h3>
                <span style={{
                  ...styles.levelBadge,
                  backgroundColor: course.level === 'diploma' ? '#e74c3c' : '#3498db'
                }}>
                  {course.level.toUpperCase()}
                </span>
              </div>

              <p style={styles.courseCode}>Course Code: {course.courseCode}</p>
              <p style={styles.courseDescription}>{course.description}</p>

              <div style={styles.courseDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>⏱</span>
                  <span>Duration: {course.duration}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>Fees: LSL {course.fees?.toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>Intake: {course.intake}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>Min Points: {course.requirements.minimumPoints}</span>
                </div>
              </div>

              <div style={styles.requirements}>
                <h4 style={styles.requirementsTitle}>Requirements:</h4>
                <ul style={styles.requirementsList}>
                  <li>Minimum Points: {course.requirements.minimumPoints}</li>
                  <li>Required Subjects: {course.requirements.requiredSubjects?.join(', ')}</li>
                  <li>Minimum Grade: {course.requirements.minimumGrade}</li>
                </ul>
              </div>

              {!eligibility.eligible && (
                <div style={styles.ineligibleBadge}>
                   {eligibility.reason}
                </div>
              )}

              <button
                onClick={() => handleApply(course)}
                disabled={!eligibility.eligible || applying || !studentData?.firstName}
                style={{
                  ...styles.applyButton,
                  opacity: (!eligibility.eligible || !studentData?.firstName) ? 0.5 : 1,
                  cursor: (!eligibility.eligible || !studentData?.firstName) ? 'not-allowed' : 'pointer'
                }}
              >
                {applying ? 'Applying...' : ' Apply Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
  warningAlert: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ffc107'
  },
  filterSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  filterLabel: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  filterSelect: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  noCoursesCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  courseCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  courseName: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50',
    flex: 1
  },
  levelBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '10px'
  },
  courseCode: {
    color: '#7f8c8d',
    fontSize: '14px',
    margin: '0 0 10px 0'
  },
  courseDescription: {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  courseDetails: {
    marginBottom: '20px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#555'
  },
  detailIcon: {
    marginRight: '10px',
    fontSize: '18px'
  },
  requirements: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  requirementsTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: '#2c3e50'
  },
  requirementsList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#555'
  },
  ineligibleBadge: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  applyButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};

export default BrowseCourses;