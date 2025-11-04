// src/pages/InstituteDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, queryDocuments } from '../firebase/helpers';

// Import components
import InstituteProfile from '../components/institute/InstituteProfile';
import ManageFaculties from '../components/institute/ManageFaculties';
import ManageCourses from '../components/institute/ManageCourses';
import ViewApplications from '../components/institute/ViewApplications';
import PublishAdmissions from '../components/institute/PublishAdmissions';

const InstituteDashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const [instituteData, setInstituteData] = useState(null);
  const [stats, setStats] = useState({
    totalFaculties: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadInstituteData();
    loadStats();
  }, [currentUser]);

  const loadInstituteData = async () => {
    if (currentUser) {
      const result = await getDocument('institutions', currentUser.uid);
      if (result.success) {
        setInstituteData(result.data);
      }
    }
  };

  const loadStats = async () => {
    if (currentUser) {
      // Load faculties
      const facultiesResult = await queryDocuments('faculties', [
        { field: 'institutionId', operator: '==', value: currentUser.uid }
      ]);

      // Load courses
      const coursesResult = await queryDocuments('courses', [
        { field: 'institutionId', operator: '==', value: currentUser.uid }
      ]);

      // Load applications
      const applicationsResult = await queryDocuments('applications', [
        { field: 'institutionId', operator: '==', value: currentUser.uid }
      ]);

      setStats({
        totalFaculties: facultiesResult.success ? facultiesResult.data.length : 0,
        totalCourses: coursesResult.success ? coursesResult.data.length : 0,
        totalApplications: applicationsResult.success ? applicationsResult.data.length : 0,
        pendingApplications: applicationsResult.success 
          ? applicationsResult.data.filter(app => app.status === 'pending').length 
          : 0
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const refreshData = () => {
    loadInstituteData();
    loadStats();
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={styles.logoText}> Institution Portal</h2>
          <p style={styles.logoSubtext}>Management Dashboard</p>
        </div>

        <nav style={styles.nav}>
          <Link to="/institute" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Home</span>
          </Link>
          <Link to="/institute/profile" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Institution Profile</span>
          </Link>
          <Link to="/institute/faculties" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Manage Faculties</span>
          </Link>
          <Link to="/institute/courses" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Manage Courses</span>
          </Link>
          <Link to="/institute/applications" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Student Applications</span>
            {stats.pendingApplications > 0 && (
              <span style={styles.badge}>{stats.pendingApplications}</span>
            )}
          </Link>
          <Link to="/institute/admissions" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Publish Admissions</span>
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{instituteData?.name || userData?.email}</p>
            <p style={styles.userRole}>Institution</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
             Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<InstituteHome instituteData={instituteData} stats={stats} />} />
          <Route path="/profile" element={<InstituteProfile refreshData={refreshData} />} />
          <Route path="/faculties" element={<ManageFaculties />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/applications" element={<ViewApplications refreshStats={loadStats} />} />
          <Route path="/admissions" element={<PublishAdmissions />} />
        </Routes>
      </div>
    </div>
  );
};

// Home Component
const InstituteHome = ({ instituteData, stats }) => {
  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.welcomeTitle}>
        Welcome back! 
      </h1>
      <p style={styles.welcomeSubtitle}>
        {instituteData?.name || 'Complete your profile to get started'}
      </p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalFaculties}</h3>
            <p style={styles.statLabel}>Faculties</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalCourses}</h3>
            <p style={styles.statLabel}>Courses</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalApplications}</h3>
            <p style={styles.statLabel}>Total Applications</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.pendingApplications}</h3>
            <p style={styles.statLabel}>Pending Review</p>
          </div>
        </div>
      </div>

      {!instituteData?.name && (
        <div style={styles.alertCard}>
          <h3 style={styles.alertTitle}> Complete Your Profile</h3>
          <p style={styles.alertText}>
            Please complete your institution profile to start managing courses and applications.
          </p>
          <Link to="/institute/profile" style={styles.alertButton}>
            Complete Profile Now
          </Link>
        </div>
      )}

      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickLinksGrid}>
          <Link to="/institute/courses" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Add New Course</h3>
            <p style={styles.quickLinkText}>Create a new course offering</p>
          </Link>

          <Link to="/institute/applications" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Review Applications</h3>
            <p style={styles.quickLinkText}>Process student applications</p>
          </Link>

          <Link to="/institute/admissions" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Publish Admissions</h3>
            <p style={styles.quickLinkText}>Announce admission results</p>
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
    backgroundColor: '#34495e',
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
    position: 'relative'
  },
  navIcon: {
    marginRight: '15px',
    fontSize: '20px'
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#e74c3c',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
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
    transition: 'transform 0.3s'
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

export default InstituteDashboard;