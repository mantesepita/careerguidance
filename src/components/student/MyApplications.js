// src/components/student/MyApplications.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments, getDocument, updateDocument } from '../../firebase/helpers';

const MyApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedApplications, setDetailedApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, [currentUser]);

  const loadApplications = async () => {
    setLoading(true);
    
    const result = await queryDocuments('applications', [
      { field: 'studentId', operator: '==', value: currentUser.uid }
    ]);

    if (result.success) {
      setApplications(result.data);
      await loadDetailsForApplications(result.data);
    }
    
    setLoading(false);
  };

  const loadDetailsForApplications = async (apps) => {
    const detailed = await Promise.all(
      apps.map(async (app) => {
        const institutionResult = await getDocument('institutions', app.institutionId);
        const courseResult = await getDocument('courses', app.courseId);
        
        return {
          ...app,
          institutionName: institutionResult.success ? institutionResult.data.name : 'Unknown',
          courseName: courseResult.success ? courseResult.data.courseName : 'Unknown',
          courseCode: courseResult.success ? courseResult.data.courseCode : 'N/A'
        };
      })
    );
    
    setDetailedApplications(detailed);
  };

  const handleConfirmAdmission = async (applicationId, institutionId) => {
    if (!window.confirm('Are you sure you want to accept this admission? This will reject all your other applications.')) {
      return;
    }

    try {
      // Update this application to confirmed
      await updateDocument('applications', applicationId, {
        confirmedAdmission: true
      });

      // Update student status
      await updateDocument('students', currentUser.uid, {
        currentStatus: 'enrolled',
        enrolledInstitution: institutionId,
        enrolledCourse: applications.find(app => app.id === applicationId).courseId
      });

      // Reload applications
      await loadApplications();
      
      alert('✅ Admission confirmed! Other applications have been cancelled.');
    } catch (error) {
      alert('Failed to confirm admission: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'admitted':
        return '#27ae60';
      case 'rejected':
        return '#e74c3c';
      case 'waiting-list':
        return '#f39c12';
      default:
        return '#3498db';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'admitted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'waiting-list':
        return '⏳';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading applications...</h2>
      </div>
    );
  }

  if (detailedApplications.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}> My Applications</h1>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}></div>
          <h2>No Applications Yet</h2>
          <p>You haven't applied to any courses yet. Start browsing courses to apply!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> My Applications</h1>
      <p style={styles.subtitle}>Track your course applications</p>

      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <strong>Total:</strong> {detailedApplications.length}
        </div>
        <div style={styles.statItem}>
          <strong>Pending:</strong> {detailedApplications.filter(a => a.status === 'pending').length}
        </div>
        <div style={styles.statItem}>
          <strong>Admitted:</strong> {detailedApplications.filter(a => a.status === 'admitted').length}
        </div>
        <div style={styles.statItem}>
          <strong>Rejected:</strong> {detailedApplications.filter(a => a.status === 'rejected').length}
        </div>
      </div>

      <div style={styles.applicationsList}>
        {detailedApplications.map(app => (
          <div key={app.id} style={styles.applicationCard}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.institutionName}>{app.institutionName}</h3>
                <p style={styles.courseName}>{app.courseName}</p>
                <p style={styles.courseCode}>Course Code: {app.courseCode}</p>
              </div>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(app.status)
              }}>
                {getStatusIcon(app.status)} {app.status.toUpperCase()}
              </div>
            </div>

            <div style={styles.applicationDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Application Date:</span>
                <span style={styles.detailValue}>
                  {new Date(app.applicationDate).toLocaleDateString('en-LS', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Your Points:</span>
                <span style={styles.detailValue}>{app.qualifications.points}</span>
              </div>

              {app.reviewNotes && (
                <div style={styles.reviewNotes}>
                  <strong>Review Notes:</strong>
                  <p>{app.reviewNotes}</p>
                </div>
              )}

              {app.status === 'admitted' && !app.confirmedAdmission && (
                <div style={styles.admissionActions}>
                  <div style={styles.admissionNotice}>
                    <strong>Congratulations!</strong> You've been admitted to this program.
                  </div>
                  <button
                    onClick={() => handleConfirmAdmission(app.id, app.institutionId)}
                    style={styles.confirmButton}
                  >
                    ✅ Accept Admission
                  </button>
                  <p style={styles.admissionWarning}>
                    ⚠️ Accepting this admission will automatically cancel all other applications.
                  </p>
                </div>
              )}

              {app.confirmedAdmission && (
                <div style={styles.confirmedBadge}>
                  ✅ Admission Confirmed - You are now enrolled in this program
                </div>
              )}

              {app.status === 'waiting-list' && (
                <div style={styles.waitingNotice}>
                   You are on the waiting list. You'll be notified if a spot becomes available.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  statItem: {
    flex: 1,
    minWidth: '150px',
    padding: '10px',
    textAlign: 'center',
    borderRight: '1px solid #e9ecef'
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  applicationCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e9ecef'
  },
  institutionName: {
    margin: '0 0 10px 0',
    fontSize: '22px',
    color: '#2c3e50'
  },
  courseName: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#555',
    fontWeight: '600'
  },
  courseCode: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  applicationDetails: {
    fontSize: '14px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f8f9fa'
  },
  detailLabel: {
    color: '#7f8c8d',
    fontWeight: '600'
  },
  detailValue: {
    color: '#2c3e50'
  },
  reviewNotes: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  admissionActions: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    border: '1px solid #c3e6cb'
  },
  admissionNotice: {
    color: '#155724',
    marginBottom: '15px',
    fontSize: '15px'
  },
  confirmButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  admissionWarning: {
    fontSize: '13px',
    color: '#856404',
    margin: 0,
    textAlign: 'center'
  },
  confirmedBadge: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '600'
  },
  waitingNotice: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '8px',
    textAlign: 'center'
  }
};

export default MyApplications;