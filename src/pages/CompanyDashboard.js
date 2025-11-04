// src/pages/CompanyDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CompanyProfile from '../components/company/CompanyProfile';
import PostJob from '../components/company/PostJob';
import ViewApplicants from '../components/company/ViewApplicants';
import SendInvitations from '../components/company/SendInvitations';

const CompanyDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activePage, setActivePage] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'profile': return <CompanyProfile />;
      case 'postJob': return <PostJob />;
      case 'applicants': return <ViewApplicants />;
      case 'invitations': return <SendInvitations />;
      default: return <CompanyProfile />;
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}> Company Panel</h2>
        <button 
          style={activePage === 'profile' ? styles.activeButton : styles.navButton}
          onClick={() => setActivePage('profile')}
        >
           Profile
        </button>
        <button 
          style={activePage === 'postJob' ? styles.activeButton : styles.navButton}
          onClick={() => setActivePage('postJob')}
        >
           Post Job
        </button>
        <button 
          style={activePage === 'applicants' ? styles.activeButton : styles.navButton}
          onClick={() => setActivePage('applicants')}
        >
           Applicants
        </button>
        <button 
          style={activePage === 'invitations' ? styles.activeButton : styles.navButton}
          onClick={() => setActivePage('invitations')}
        >
           Invitations
        </button>

        {/* Logout button at bottom */}
        <div style={{ flexGrow: 1 }} />
        <button onClick={handleLogout} style={styles.logoutButton}>
           Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>
            Welcome, {currentUser?.displayName || 'Company User'} 
          </h1>
        </header>
        <section style={styles.pageContent}>{renderPage()}</section>
      </main>
    </div>
  );
};

const styles = {
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  },
  sidebarTitle: {
    fontSize: '22px',
    marginBottom: '30px',
    borderBottom: '1px solid #34495e',
    paddingBottom: '10px'
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    padding: '10px 0',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: '0.3s',
  },
  activeButton: {
    backgroundColor: '#3498db',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    padding: '10px 0',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '8px',
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s',
  },
  mainContent: {
    flex: 1,
    padding: '30px',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '22px',
    color: '#2c3e50'
  },
  pageContent: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  }
};

export default CompanyDashboard;
