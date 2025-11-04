// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllDocuments, queryDocuments } from '../firebase/helpers';

// Import components
import ManageInstitutions from '../components/admin/ManageInstitutions';
import ManageCompanies from '../components/admin/ManageCompanies';
import SystemReports from '../components/admin/SystemReports';
import SystemSettings from '../components/admin/SystemSettings';

const AdminDashboard = () => {
  const { userData, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalCompanies: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingInstitutions: 0,
    pendingCompanies: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load all users
      const usersResult = await getAllDocuments('users');
      
      // Load institutions
      const institutionsResult = await getAllDocuments('institutions');
      const pendingInstitutions = institutionsResult.success 
        ? institutionsResult.data.filter(inst => inst.status === 'pending').length 
        : 0;

      // Load companies
      const companiesResult = await getAllDocuments('companies');
      const pendingCompanies = companiesResult.success 
        ? companiesResult.data.filter(comp => comp.status === 'pending').length 
        : 0;

      // Load students
      const studentsResult = await getAllDocuments('students');

      // Load courses
      const coursesResult = await getAllDocuments('courses');

      // Load applications
      const applicationsResult = await getAllDocuments('applications');

      setStats({
        totalUsers: usersResult.success ? usersResult.data.length : 0,
        totalInstitutions: institutionsResult.success ? institutionsResult.data.length : 0,
        totalCompanies: companiesResult.success ? companiesResult.data.length : 0,
        totalStudents: studentsResult.success ? studentsResult.data.length : 0,
        totalCourses: coursesResult.success ? coursesResult.data.length : 0,
        totalApplications: applicationsResult.success ? applicationsResult.data.length : 0,
        pendingInstitutions,
        pendingCompanies
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const refreshStats = () => {
    loadStats();
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={styles.logoText}> Admin Portal</h2>
          <p style={styles.logoSubtext}>System Administration</p>
        </div>

        <nav style={styles.nav}>
          <Link to="/admin" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/institutions" style={styles.navItem}>
            <span style={styles.navIcon}></span>
            <span>Manage Institutions</span>
            {stats.pendingInstitutions > 0 && (
              <span style={styles.badge}>{stats.pendingInstitutions}</span>
            )}
          </Link>
          <Link to="/admin/companies" style={styles.navItem}>
            <span style={styles.navIcon}>🏢</span>
            <span>Manage Companies</span>
            {stats.pendingCompanies > 0 && (
              <span style={styles.badge}>{stats.pendingCompanies}</span>
            )}
          </Link>
          <Link to="/admin/reports" style={styles.navItem}>
            <span style={styles.navIcon}>📊</span>
            <span>System Reports</span>
          </Link>
          <Link to="/admin/settings" style={styles.navItem}>
            <span style={styles.navIcon}>⚙️</span>
            <span>System Settings</span>
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{userData?.email}</p>
            <p style={styles.userRole}>Administrator</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
             Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<AdminHome stats={stats} />} />
          <Route path="/institutions" element={<ManageInstitutions refreshStats={refreshStats} />} />
          <Route path="/companies" element={<ManageCompanies refreshStats={refreshStats} />} />
          <Route path="/reports" element={<SystemReports stats={stats} />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </div>
  );
};

// Admin Home Component
const AdminHome = ({ stats }) => {
  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.welcomeTitle}>System Overview</h1>
      <p style={styles.welcomeSubtitle}>Monitor and manage the entire platform</p>

      {/* Main Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalUsers}</h3>
            <p style={styles.statLabel}>Total Users</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalStudents}</h3>
            <p style={styles.statLabel}>Students</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalInstitutions}</h3>
            <p style={styles.statLabel}>Institutions</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalCompanies}</h3>
            <p style={styles.statLabel}>Companies</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalCourses}</h3>
            <p style={styles.statLabel}>Total Courses</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}></div>
          <div>
            <h3 style={styles.statNumber}>{stats.totalApplications}</h3>
            <p style={styles.statLabel}>Applications</p>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {(stats.pendingInstitutions > 0 || stats.pendingCompanies > 0) && (
        <div style={styles.alertSection}>
          <h2 style={styles.sectionTitle}>Pending Approvals</h2>
          <div style={styles.alertsGrid}>
            {stats.pendingInstitutions > 0 && (
              <Link to="/admin/institutions" style={styles.alertCard}>
                <div style={styles.alertIcon}></div>
                <div>
                  <h3 style={styles.alertNumber}>{stats.pendingInstitutions}</h3>
                  <p style={styles.alertLabel}>Institutions Pending Approval</p>
                </div>
              </Link>
            )}

            {stats.pendingCompanies > 0 && (
              <Link to="/admin/companies" style={styles.alertCard}>
                <div style={styles.alertIcon}></div>
                <div>
                  <h3 style={styles.alertNumber}>{stats.pendingCompanies}</h3>
                  <p style={styles.alertLabel}>Companies Pending Approval</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickLinksGrid}>
          <Link to="/admin/institutions" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Review Institutions</h3>
            <p style={styles.quickLinkText}>Approve or suspend institutions</p>
          </Link>

          <Link to="/admin/companies" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>Review Companies</h3>
            <p style={styles.quickLinkText}>Manage company registrations</p>
          </Link>

          <Link to="/admin/reports" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}></span>
            <h3 style={styles.quickLinkTitle}>View Reports</h3>
            <p style={styles.quickLinkText}>Generate system reports</p>
          </Link>

          <Link to="/admin/settings" style={styles.quickLinkCard}>
            <span style={styles.quickLinkIcon}>⚙️</span>
            <h3 style={styles.quickLinkTitle}>System Settings</h3>
            <p style={styles.quickLinkText}>Configure platform settings</p>
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
    backgroundColor: '#1a252f',
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
    maxWidth: '1400px'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
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
  alertSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    padding: '25px',
    borderRadius: '12px',
    border: '2px solid #ffc107',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    textDecoration: 'none',
    transition: 'transform 0.3s'
  },
  alertIcon: {
    fontSize: '48px'
  },
  alertNumber: {
    fontSize: '28px',
    margin: '0 0 5px 0',
    color: '#856404',
    fontWeight: 'bold'
  },
  alertLabel: {
    margin: 0,
    color: '#856404',
    fontSize: '14px'
  },
  quickActions: {
    marginTop: '40px'
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

export default AdminDashboard;