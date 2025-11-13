// src/components/student/BrowseCourses.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllDocuments, 
  queryDocuments, 
  createDocument, 
  canStudentApply 
} from '../../firebase/helpers';

const GRADE_POINTS = {
  'A*': 7,
  'A': 6,
  'B': 5,
  'C': 4,
  'D': 3,
  'E': 2,
  'F': 1
};

const BrowseCourses = ({ studentData }) => {
  const { currentUser } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAll, setShowAll] = useState(false);

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

  const checkSubjectRequirements = (course) => {
    if (!studentData || !studentData.highSchool || !studentData.highSchool.subjects) {
      return { 
        eligible: false, 
        reason: 'Please complete your profile with subjects and grades',
        missingSubjects: [],
        hasSubjects: false
      };
    }

    const studentSubjects = studentData.highSchool.subjects;
    const requiredSubjects = course.requirements.requiredSubjects || [];
    const minimumGrade = course.requirements.minimumGrade || 'E';
    
    // Check if student has the required subjects
    const missingSubjects = [];
    const subjectMatches = [];

    for (const reqSubject of requiredSubjects) {
      const studentSubject = studentSubjects.find(s => 
        s.subject.toLowerCase() === reqSubject.toLowerCase()
      );

      if (!studentSubject) {
        missingSubjects.push(reqSubject);
      } else {
        // Check if grade meets minimum requirement
        const studentGradePoints = GRADE_POINTS[studentSubject.grade] || 0;
        const minimumGradePoints = GRADE_POINTS[minimumGrade] || 0;

        subjectMatches.push({
          subject: reqSubject,
          studentGrade: studentSubject.grade,
          meetsRequirement: studentGradePoints >= minimumGradePoints
        });

        if (studentGradePoints < minimumGradePoints) {
          missingSubjects.push(`${reqSubject} (Grade too low: ${studentSubject.grade}, need ${minimumGrade} or better)`);
        }
      }
    }

    return {
      missingSubjects,
      subjectMatches,
      hasAllSubjects: missingSubjects.length === 0
    };
  };

  const checkEligibility = (course) => {
    if (!studentData || !studentData.highSchool) {
      return { 
        eligible: false, 
        reason: 'Please complete your profile first',
        details: {}
      };
    }

    const studentPoints = studentData.highSchool.points;
    const requiredPoints = course.requirements.minimumPoints;

    // Check points
    if (studentPoints < requiredPoints) {
      return { 
        eligible: false, 
        reason: `Insufficient points. Required: ${requiredPoints}, You have: ${studentPoints}`,
        details: { pointsMet: false }
      };
    }

    // Check subject requirements
    const subjectCheck = checkSubjectRequirements(course);
    
    if (!subjectCheck.hasAllSubjects) {
      return {
        eligible: false,
        reason: `Missing required subjects or grades`,
        details: {
          pointsMet: true,
          subjectsMet: false,
          missingSubjects: subjectCheck.missingSubjects,
          subjectMatches: subjectCheck.subjectMatches
        }
      };
    }

    return { 
      eligible: true,
      details: {
        pointsMet: true,
        subjectsMet: true,
        subjectMatches: subjectCheck.subjectMatches
      }
    };
  };

  const handleApply = async (course) => {
    setMessage({ type: '', text: '' });

    // Check if profile is complete
    if (!studentData || !studentData.firstName) {
      setMessage({ 
        type: 'error', 
        text: '⚠️ Please complete your profile before applying' 
      });
      return;
    }

    // Check eligibility
    const eligibility = checkEligibility(course);
    if (!eligibility.eligible) {
      setMessage({ type: 'error', text: `❌ ${eligibility.reason}` });
      return;
    }

    // Check application limit
    const canApply = await canStudentApply(currentUser.uid, course.institutionId);
    if (!canApply) {
      setMessage({ 
        type: 'error', 
        text: '⚠️ You have reached the maximum of 2 applications for this institution' 
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
          overallGrade: calculateOverallGrade(studentData.highSchool.points)
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

  const calculateOverallGrade = (points) => {
    if (points >= 42) return 'A*';
    if (points >= 35) return 'A';
    if (points >= 28) return 'B';
    if (points >= 21) return 'C';
    if (points >= 14) return 'D';
    return 'E';
  };

  const getFilteredCourses = () => {
    if (showAll) {
      return courses;
    }
    return courses.filter(course => checkEligibility(course).eligible);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();
  const qualifiedCount = courses.filter(c => checkEligibility(c).eligible).length;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Browse Courses</h1>
      <p style={styles.subtitle}>Find and apply to courses that match your qualifications</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {!studentData?.firstName && (
        <div style={styles.warningAlert}>
          <strong>⚠️ Profile Incomplete</strong>
          <p>Please complete your profile with subjects and grades before applying to courses.</p>
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

      {/* Filter Toggle */}
      {selectedInstitution && courses.length > 0 && (
        <div style={styles.filterToggle}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              style={styles.checkbox}
            />
            <span>Show all courses (including those you don't qualify for)</span>
          </label>
          <div style={styles.qualificationStats}>
            <span style={styles.statBadge}>
              ✅ You qualify for <strong>{qualifiedCount}</strong> out of <strong>{courses.length}</strong> courses
            </span>
          </div>
        </div>
      )}

      {/* Courses List */}
      {selectedInstitution && filteredCourses.length === 0 && (
        <div style={styles.noCoursesCard}>
          <h3>
            {showAll ? 'No courses available' : 'No qualifying courses found'}
          </h3>
          <p>
            {showAll 
              ? 'This institution has no open admissions at the moment.'
              : 'You don\'t meet the requirements for any courses at this institution. Try checking "Show all courses" to see what\'s available.'}
          </p>
        </div>
      )}

      <div style={styles.coursesGrid}>
        {filteredCourses.map(course => {
          const eligibility = checkEligibility(course);
          
          return (
            <div 
              key={course.id} 
              style={{
                ...styles.courseCard,
                opacity: eligibility.eligible ? 1 : 0.7,
                borderLeft: eligibility.eligible ? '4px solid #27ae60' : '4px solid #e74c3c'
              }}
            >
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
                  <span style={styles.detailIcon}>⏱️</span>
                  <span>Duration: {course.duration}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>💰</span>
                  <span>Fees: LSL {course.fees?.toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📅</span>
                  <span>Intake: {course.intake}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>🎯</span>
                  <span>Min Points: {course.requirements.minimumPoints}</span>
                </div>
              </div>

              <div style={styles.requirements}>
                <h4 style={styles.requirementsTitle}>Requirements:</h4>
                <ul style={styles.requirementsList}>
                  <li>
                    Minimum Points: {course.requirements.minimumPoints}
                    {eligibility.details?.pointsMet && (
                      <span style={styles.metBadge}> ✅ Met</span>
                    )}
                    {eligibility.details?.pointsMet === false && (
                      <span style={styles.notMetBadge}> ❌ Not Met</span>
                    )}
                  </li>
                  <li>
                    Required Subjects: {course.requirements.requiredSubjects?.join(', ') || 'None specified'}
                  </li>
                  <li>Minimum Grade: {course.requirements.minimumGrade}</li>
                </ul>
              </div>

              {/* Subject Match Details */}
              {eligibility.details?.subjectMatches && eligibility.details.subjectMatches.length > 0 && (
                <div style={styles.subjectMatches}>
                  <h4 style={styles.matchTitle}>Your Subject Matches:</h4>
                  <div style={styles.matchGrid}>
                    {eligibility.details.subjectMatches.map((match, idx) => (
                      <div key={idx} style={styles.matchItem}>
                        <span style={styles.matchIcon}>
                          {match.meetsRequirement ? '✅' : '❌'}
                        </span>
                        <span>{match.subject}: {match.studentGrade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Subjects Warning */}
              {eligibility.details?.missingSubjects && eligibility.details.missingSubjects.length > 0 && (
                <div style={styles.missingSubjects}>
                  <strong>⚠️ Missing Requirements:</strong>
                  <ul style={styles.missingList}>
                    {eligibility.details.missingSubjects.map((subj, idx) => (
                      <li key={idx}>{subj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!eligibility.eligible && (
                <div style={styles.ineligibleBadge}>
                  ❌ {eligibility.reason}
                </div>
              )}

              {eligibility.eligible && (
                <div style={styles.eligibleBadge}>
                  ✅ You qualify for this course!
                </div>
              )}

              <button
                onClick={() => handleApply(course)}
                disabled={!eligibility.eligible || applying || !studentData?.firstName}
                style={{
                  ...styles.applyButton,
                  opacity: (!eligibility.eligible || !studentData?.firstName) ? 0.5 : 1,
                  cursor: (!eligibility.eligible || !studentData?.firstName) ? 'not-allowed' : 'pointer',
                  backgroundColor: eligibility.eligible ? '#27ae60' : '#95a5a6'
                }}
              >
                {applying ? '⏳ Applying...' : eligibility.eligible ? '📝 Apply Now' : '🔒 Not Eligible'}
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
    marginBottom: '20px',
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
  filterToggle: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px'
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  qualificationStats: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #e9ecef'
  },
  statBadge: {
    display: 'inline-block',
    padding: '8px 15px',
    backgroundColor: '#e7f3ff',
    color: '#2c3e50',
    borderRadius: '20px',
    fontSize: '13px'
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
    marginBottom: '15px'
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
  metBadge: {
    color: '#27ae60',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '5px'
  },
  notMetBadge: {
    color: '#e74c3c',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '5px'
  },
  subjectMatches: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  matchTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#2c3e50'
  },
  matchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  matchItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#2c3e50'
  },
  matchIcon: {
    marginRight: '6px',
    fontSize: '14px'
  },
  missingSubjects: {
    backgroundColor: '#fff3cd',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#856404'
  },
  missingList: {
    margin: '8px 0 0 0',
    paddingLeft: '20px'
  },
  eligibleBadge: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: '600'
  },
  ineligibleBadge: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
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