// src/components/student/BrowseJobs.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  queryDocuments, 
  getDocument, 
  createDocument, 
  calculateJobMatchScore 
} from '../../firebase/helpers';

const BrowseJobs = ({ studentData }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [detailedJobs, setDetailedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all'); // all, matched, high-match

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    
    const result = await queryDocuments('jobs', [
      { field: 'status', operator: '==', value: 'active' }
    ]);

    if (result.success) {
      setJobs(result.data);
      await loadJobDetails(result.data);
    }
    
    setLoading(false);
  };

  const loadJobDetails = async (jobsList) => {
    const detailed = await Promise.all(
      jobsList.map(async (job) => {
        const companyResult = await getDocument('companies', job.companyId);
        
        // Calculate match score if student has graduated
        let matchScore = 0;
        if (studentData && studentData.graduationInfo?.graduated) {
          matchScore = calculateJobMatchScore(studentData, job.requirements);
        }
        
        return {
          ...job,
          companyName: companyResult.success ? companyResult.data.companyName : 'Unknown',
          companyLogo: companyResult.success ? companyResult.data.logo : null,
          matchScore
        };
      })
    );
    
    setDetailedJobs(detailed);
  };

  const handleApply = async (job) => {
    setMessage({ type: '', text: '' });

    // Check if graduated
    if (!studentData || !studentData.graduationInfo?.graduated) {
      setMessage({ 
        type: 'error', 
        text: ' You must graduate and upload your transcript before applying for jobs' 
      });
      return;
    }

    // Check if already applied
    const existingApp = await queryDocuments('jobApplications', [
      { field: 'jobId', operator: '==', value: job.id },
      { field: 'studentId', operator: '==', value: currentUser.uid }
    ]);

    if (existingApp.success && existingApp.data.length > 0) {
      setMessage({ type: 'error', text: ' You have already applied to this job' });
      return;
    }

    setApplying(true);

    try {
      const matchScore = calculateJobMatchScore(studentData, job.requirements);

      // Check qualifications match
      const qualificationMatch = {
        educationMatch: studentData.graduationInfo.graduated,
        cgpaMatch: studentData.graduationInfo.cgpa >= (job.requirements.minCGPA || 0),
        skillsMatch: studentData.skills?.filter(skill => 
          job.requirements.skills?.includes(skill)
        ) || [],
        experienceMatch: studentData.workExperience?.length > 0 || false
      };

      const applicationData = {
        jobId: job.id,
        studentId: currentUser.uid,
        companyId: job.companyId,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        matchScore,
        qualificationMatch,
        coverLetter: '' // Can be extended to include cover letter
      };

      const result = await createDocument('jobApplications', applicationData);

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

  const getFilteredJobs = () => {
    if (filter === 'matched') {
      return detailedJobs.filter(job => job.matchScore >= 50);
    }
    if (filter === 'high-match') {
      return detailedJobs.filter(job => job.matchScore >= 70);
    }
    return detailedJobs;
  };

  const getMatchColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading jobs...</h2>
      </div>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Job Opportunities</h1>
      <p style={styles.subtitle}>Find jobs that match your qualifications</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {!studentData?.graduationInfo?.graduated && (
        <div style={styles.warningAlert}>
          <strong> Not Eligible for Jobs</strong>
          <p>You must graduate and upload your transcript to apply for jobs.</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        <button 
          onClick={() => setFilter('all')}
          style={{
            ...styles.filterTab,
            ...(filter === 'all' ? styles.activeFilterTab : {})
          }}
        >
          All Jobs ({detailedJobs.length})
        </button>
        <button 
          onClick={() => setFilter('matched')}
          style={{
            ...styles.filterTab,
            ...(filter === 'matched' ? styles.activeFilterTab : {})
          }}
        >
          Matched (50%+) ({detailedJobs.filter(j => j.matchScore >= 50).length})
        </button>
        <button 
          onClick={() => setFilter('high-match')}
          style={{
            ...styles.filterTab,
            ...(filter === 'high-match' ? styles.activeFilterTab : {})
          }}
        >
          High Match (70%+) ({detailedJobs.filter(j => j.matchScore >= 70).length})
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}></div>
          <h2>No Jobs Found</h2>
          <p>No job opportunities match your current filter.</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {filteredJobs.map(job => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.companyName}>{job.companyName}</p>
                  <p style={styles.location}> {job.location}</p>
                </div>
                {studentData?.graduationInfo?.graduated && (
                  <div style={{
                    ...styles.matchBadge,
                    backgroundColor: getMatchColor(job.matchScore)
                  }}>
                    {job.matchScore}% Match
                  </div>
                )}
              </div>

              <p style={styles.jobDescription}>{job.description}</p>

              <div style={styles.jobDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>{job.employmentType}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>LSL {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}></span>
                  <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={styles.requirements}>
                <h4 style={styles.requirementsTitle}>Requirements:</h4>
                <ul style={styles.requirementsList}>
                  <li>Education: {job.requirements.education}</li>
                  <li>Minimum CGPA: {job.requirements.minCGPA}</li>
                  <li>Experience: {job.requirements.experience}</li>
                  <li>Skills: {job.requirements.skills?.join(', ')}</li>
                </ul>
              </div>

              {studentData?.graduationInfo?.graduated && (
                <div style={styles.matchDetails}>
                  <h4 style={styles.matchDetailsTitle}>Your Match:</h4>
                  <div style={styles.matchGrid}>
                    <div style={styles.matchItem}>
                      <span style={styles.matchIcon}>
                        {studentData.graduationInfo.graduated ? '✅' : '❌'}
                      </span>
                      <span>Education</span>
                    </div>
                    <div style={styles.matchItem}>
                      <span style={styles.matchIcon}>
                        {studentData.graduationInfo.cgpa >= job.requirements.minCGPA ? '✅' : '❌'}
                      </span>
                      <span>CGPA</span>
                    </div>
                    <div style={styles.matchItem}>
                      <span style={styles.matchIcon}>
                        {studentData.skills?.some(s => job.requirements.skills?.includes(s)) ? '✅' : '❌'}
                      </span>
                      <span>Skills</span>
                    </div>
                    <div style={styles.matchItem}>
                      <span style={styles.matchIcon}>
                        {studentData.workExperience?.length > 0 ? '✅' : '⚠️'}
                      </span>
                      <span>Experience</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleApply(job)}
                disabled={!studentData?.graduationInfo?.graduated || applying}
                style={{
                  ...styles.applyButton,
                  opacity: !studentData?.graduationInfo?.graduated ? 0.5 : 1,
                  cursor: !studentData?.graduationInfo?.graduated ? 'not-allowed' : 'pointer'
                }}
              >
                {applying ? ' Applying...' : ' Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
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
  filterTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  filterTab: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    transition: 'all 0.3s'
  },
  activeFilterTab: {
    backgroundColor: '#3498db',
    color: 'white',
    borderColor: '#3498db'
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
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '25px'
  },
  jobCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e9ecef'
  },
  jobTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: '#2c3e50'
  },
  companyName: {
    margin: '0 0 5px 0',
    fontSize: '15px',
    color: '#7f8c8d',
    fontWeight: '600'
  },
  location: {
    margin: 0,
    fontSize: '14px',
    color: '#7f8c8d'
  },
  matchBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },
  jobDescription: {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  jobDetails: {
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
    fontSize: '15px',
    color: '#2c3e50'
  },
  requirementsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#555'
  },
  matchDetails: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  matchDetailsTitle: {
    margin: '0 0 12px 0',
    fontSize: '15px',
    color: '#2c3e50'
  },
  matchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  matchItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#2c3e50'
  },
  matchIcon: {
    marginRight: '8px',
    fontSize: '16px'
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

export default BrowseJobs;