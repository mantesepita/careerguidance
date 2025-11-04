// src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocument } from '../firebase/helpers';

// Import components (we'll create these)
import StudentProfile from '../components/student/StudentProfile';
import BrowseCourses from '../components/student/BrowseCourses';
import MyApplications from '../components/student/MyApplications';
import UploadDocuments from '../components/student/UploadDocuments';
import BrowseJobs from '../components/student/BrowseJobs';

const StudentDashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    if (currentUser) {
      const result = await getDocument('students', currentUser.uid);
      if (result.success) {
        setStudentData(result.data);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const refreshData = () => {
    loadStudentData();
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={styles.logoText}> Career Portal</h2>
          <p style={styles.logoSubtext}>Student Dashboard</p>
        </div>

        <nav style={styles.nav}>
          <Link to="/student" style={styles.navItem} onClick={() => setActiveTab('home')}>
            <span style={styles.navIcon}></span>
            <span>Home</span>
          </Link>
          <Link to="/student/profile" style={styles.navItem} onClick={() => setActiveTab('profile')}>
            <span style={styles.navIcon}></span>
            <span>My Profile</span>
          </Link>
          <Link to="/student/browse-courses" style={styles.navItem} onClick={() => setActiveTab('courses')}>
            <span style={styles.navIcon}></span>
            <span>Browse Courses</span>
          </Link>
          <Link to="/student/applications" style={styles.navItem} onClick={() => setActiveTab('applications')}>
            <span style={styles.navIcon}></span>
            <span>My Applications</span>
          </Link>
          <Link to="/student/documents" style={styles.navItem} onClick={() => setActiveTab('documents')}>
            <span style={styles.navIcon}></span>
            <span>Upload Documents</span>
          </Link>
          <Link to="/student/jobs" style={styles.navItem} onClick={() => setActiveTab('jobs')}>
            <span style={styles.navIcon}></span>
            <span>Job Opportunities</span>
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{userData?.email}</p>
            <p style={styles.userRole}>Student</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<StudentHome studentData={studentData} />} />
          <Route path="/profile" element={<StudentProfile refreshData={refreshData} />} />
          <Route path="/browse-courses" element={<BrowseCourses studentData={studentData} />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/documents" element={<UploadDocuments refreshData={refreshData} />} />
          <Route path="/jobs" element={<BrowseJobs studentData={studentData} />} />
        </Routes>
      </div>
    </div>
  );
};

// Home Component
const StudentHome = ({ studentData }) => {
  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.welcomeTitle}>
        Welcome back! 
      </h1>
      <p style={styles.welcomeSubtitle}>
        {studentData?.firstName ? `${studentData.firstName} ${studentData.lastName}` : 'Complete your profile to get started'}
      </p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>0</h3>
            <p style={styles.statLabel}>Active Applications</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <h3 style={styles.statNumber}>0</h3>
            <p style={styles.statLabel}>Admitted</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>0</h3>
            <p style={styles.statLabel}>Job Applications</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{studentData?.profileCompleted ? '100%' : '20%'}</h3>
            <p style={styles.statLabel}>Profile Complete</p>
          </div>
        </div>
      </div>

      {!studentData?.firstName && (
        <div style={styles.alertCard}>
          <h3 style={styles.alertTitle}> Complete Your Profile</h3>
          <p style={styles.alertText}>
            Please complete your profile to start applying for courses and jobs.
          </p>
          <Link to="/student/profile" style={styles.alertButton}>
            Complete Profile Now
          </Link>
        </div>
      )}

      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickLinksGrid}>
          <Link to="/student/browse-courses" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Browse Courses</h3>
            <p style={styles.quickLinkText}>Explore available programs</p>
          </Link>

          <Link to="/student/applications" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>My Applications</h3>
            <p style={styles.quickLinkText}>Track your applications</p>
          </Link>

          <Link to="/student/jobs" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Find Jobs</h3>
            <p style={styles.quickLinkText}>Browse opportunities</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f7fa'
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  logo: {
    padding: '30px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logoText: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold'
  },
  logoSubtext: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    opacity: 0.7
  },
  nav: {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontSize: '15px',
    cursor: 'pointer'
  },
  navIcon: {
    marginRight: '15px',
    fontSize: '20px'
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  userInfo: {
    marginBottom: '15px'
  },
  userName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600'
  },
  userRole: {
    margin: '5px 0 0 0',
    fontSize: '12px',
    opacity: 0.7
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    padding: '30px'
  },
  homeContainer: {
    maxWidth: '1200px'
  },
  welcomeTitle: {
    fontSize: '36px',
    margin: '0 0 10px 0',
    color: '#2c3e50'
  },
  welcomeSubtitle: {
    fontSize: '18px',
    color: '#7f8c8d',
    marginBottom: '30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  statIcon: {
    fontSize: '40px'
  },
  statNumber: {
    fontSize: '32px',
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  statLabel: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '14px'
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    border: '1px solid #ffc107'
  },
  alertTitle: {
    margin: '0 0 10px 0',
    color: '#856404'
  },
  alertText: {
    margin: '0 0 15px 0',
    color: '#856404'
  },
  alertButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: '#856404',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600'
  },
  quickLinks: {
    marginTop: '30px'
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  quickLinkCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  quickLinkIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '15px'
  },
  quickLinkTitle: {
    margin: '0 0 10px 0',
    color: '#2c3e50',
    fontSize: '20px'
  },
  quickLinkText: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '14px'
  }
};

export default StudentDashboard;