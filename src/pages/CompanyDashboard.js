import React, { useState, useEffect } from 'react';
import { Home, Building2, Briefcase, Users, Send, LogOut, Menu, X, Bell, Plus, TrendingUp, Mail, Calendar, FileText, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, queryDocuments, createDocument, updateDocument } from '../firebase/helpers';
import logo from './logo.png';
import Footer from './Footer';

const CompanyDashboard = () => {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    industry: ''
  });
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    invitationsSent: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadCompanyData();
    }
  }, [currentUser]);

  const loadCompanyData = async () => {
    if (!currentUser) return;

    try {
      // Load company profile
      const companyResult = await getDocument('companies', currentUser.uid);
      if (companyResult.success && companyResult.data) {
        setCompanyData({
          name: companyResult.data.name || '',
          email: companyResult.data.email || currentUser.email,
          industry: companyResult.data.industry || ''
        });
      } else {
        setCompanyData({
          name: '',
          email: currentUser.email,
          industry: ''
        });
      }

      // Load stats
      await loadStats();
    } catch (error) {
      console.error('Error loading company data:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Load active jobs count
      const jobsResult = await queryDocuments('jobs', [
        { field: 'companyId', operator: '==', value: currentUser.uid },
        { field: 'status', operator: '==', value: 'active' }
      ]);
      const activeJobs = jobsResult.success ? jobsResult.data.length : 0;

      // Load total applicants
      const applicationsResult = await queryDocuments('jobApplications', [
        { field: 'companyId', operator: '==', value: currentUser.uid }
      ]);
      const totalApplicants = applicationsResult.success ? applicationsResult.data.length : 0;

      // Load shortlisted applicants
      const shortlistedResult = await queryDocuments('jobApplications', [
        { field: 'companyId', operator: '==', value: currentUser.uid },
        { field: 'status', operator: '==', value: 'shortlisted' }
      ]);
      const shortlisted = shortlistedResult.success ? shortlistedResult.data.length : 0;

      // Load invitations sent
      const invitationsResult = await queryDocuments('invitations', [
        { field: 'companyId', operator: '==', value: currentUser.uid }
      ]);
      const invitationsSent = invitationsResult.success ? invitationsResult.data.length : 0;

      setStats({
        activeJobs,
        totalApplicants,
        shortlisted,
        invitationsSent
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const navigation = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'postJob', label: 'Post Job', icon: Plus },
    { id: 'applicants', label: 'View Applicants', icon: Users },
    { id: 'invitations', label: 'Send Invitations', icon: Send }
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'home':
        return <HomePage companyData={companyData} stats={stats} setActivePage={setActivePage} refreshData={loadStats} />;
      case 'profile':
        return <ProfilePage refreshData={loadCompanyData} />;
      case 'postJob':
        return <PostJobPage refreshData={loadStats} />;
      case 'applicants':
        return <ApplicantsPage stats={stats} />;
      case 'invitations':
        return <InvitationsPage refreshData={loadStats} />;
      default:
      return <HomePage companyData={companyData} stats={stats} setActivePage={setActivePage} refreshData={loadStats} />;
    }
  };

  // Inline styles (same as before)
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbeb, #fef2f2, #fffbeb)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #fed7aa'
    },
    navContainer: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '0 1rem'
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '4rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoIcon: {
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    logoSubtext: {
      fontSize: '0.75rem',
      color: '#4b5563'
    },
    desktopNav: {
      display: 'none',
      alignItems: 'center',
      gap: '1.5rem'
    },
    postJobButton: {
      padding: '0.5rem 1rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    postJobButtonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    bellButton: {
      position: 'relative',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.3s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    bellButtonHover: {
      backgroundColor: '#fed7aa'
    },
    bellDot: {
      position: 'absolute',
      top: '0.25rem',
      right: '0.25rem',
      width: '0.5rem',
      height: '0.5rem',
      backgroundColor: '#ef4444',
      borderRadius: '50%'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      paddingLeft: '1rem',
      borderLeft: '1px solid #fed7aa'
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1f2937'
    },
    userRole: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    logoutButton: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.3s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    logoutButtonHover: {
      backgroundColor: '#fee2e2'
    },
    mobileMenuButton: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.3s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    mobileMenuButtonHover: {
      backgroundColor: '#fed7aa'
    },
    mobileMenu: {
      position: 'fixed',
      inset: 0,
      top: '4rem',
      zIndex: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)'
    },
    mobileMenuContent: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      transition: 'all 0.3s',
      border: 'none',
      cursor: 'pointer',
      position: 'relative'
    },
    navButtonActive: {
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    navButtonInactive: {
      backgroundColor: 'transparent',
      color: '#374151'
    },
    navButtonHover: {
      backgroundColor: '#fed7aa'
    },
    navButtonActiveHover: {
      transform: 'scale(1.05)'
    },
    sidebar: {
      display: 'none',
      width: '18rem',
      minHeight: '100vh',
      padding: '1.5rem'
    },
    sidebarNav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    mainContent: {
      flex: 1,
      padding: '1.5rem'
    },
    mediaQueries: {
      md: '@media (min-width: 768px)'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    postJobButton: false,
    bellButton: false,
    logoutButton: false,
    mobileMenuButton: false,
    navButtons: {}
  });

  const handleMouseEnter = (item, type) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: { ...prev[type], [item]: true }
    }));
  };

  const handleMouseLeave = (item, type) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: { ...prev[type], [item]: false }
    }));
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navContent}>
            {/* Logo */}
            <div style={styles.logo}>
              <div >
                <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
              </div>
              <div>
                <h1 style={styles.logoText}>Company Panel</h1>
                <p style={styles.logoSubtext}>Recruitment Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div style={styles.desktopNav}>
              <button 
                onClick={() => setActivePage('postJob')}
                style={{
                  ...styles.postJobButton,
                  ...(hoverStates.postJobButton && styles.postJobButtonHover)
                }}
                onMouseEnter={() => handleMouseEnter('postJobButton', 'postJobButton')}
                onMouseLeave={() => handleMouseLeave('postJobButton', 'postJobButton')}
              >
                <Plus size={16} />
                Post New Job
              </button>
              <button 
                style={{
                  ...styles.bellButton,
                  ...(hoverStates.bellButton && styles.bellButtonHover)
                }}
                onMouseEnter={() => handleMouseEnter('bellButton', 'bellButton')}
                onMouseLeave={() => handleMouseLeave('bellButton', 'bellButton')}
              >
                <Bell size={20} color="#4b5563" />
                <span style={styles.bellDot}></span>
              </button>
              <div style={styles.userSection}>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.userName}>{companyData.name || 'Company'}</p>
                  <p style={styles.userRole}>Company</p>
                </div>
                <button 
                  style={{
                    ...styles.logoutButton,
                    ...(hoverStates.logoutButton && styles.logoutButtonHover)
                  }}
                  onMouseEnter={() => handleMouseEnter('logoutButton', 'logoutButton')}
                  onMouseLeave={() => handleMouseLeave('logoutButton', 'logoutButton')}
                >
                  <LogOut size={20} color="#4b5563" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                ...styles.mobileMenuButton,
                ...(hoverStates.mobileMenuButton && styles.mobileMenuButtonHover)
              }}
              onMouseEnter={() => handleMouseEnter('mobileMenuButton', 'mobileMenuButton')}
              onMouseLeave={() => handleMouseLeave('mobileMenuButton', 'mobileMenuButton')}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuContent}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    ...styles.navButton,
                    ...(activePage === item.id ? styles.navButtonActive : styles.navButtonInactive),
                    ...(hoverStates.navButtons[item.id] && (activePage === item.id ? styles.navButtonActiveHover : styles.navButtonHover))
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon size={20} />
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', maxWidth: '80rem', margin: '0 auto' }}>
        {/* Sidebar - Desktop */}
        <aside style={styles.sidebar}>
          <nav style={styles.sidebarNav}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    ...styles.navButton,
                    ...(activePage === item.id ? styles.navButtonActive : styles.navButtonInactive),
                    ...(hoverStates.navButtons[item.id] && (activePage === item.id ? styles.navButtonActiveHover : styles.navButtonHover))
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon size={20} />
                  <span style={{ fontWeight: 500, flex: 1, textAlign: 'left' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {renderContent()}
        </main>
      </div>

      <style>{`
        ${styles.mediaQueries.md} {
          .desktop-nav { display: flex !important; }
          .sidebar { display: block !important; }
          .mobile-menu-button { display: none !important; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// Updated HomePage with real data
const HomePage = ({ companyData, stats, setActivePage, refreshData }) => {
  const { currentUser } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadRecentActivity();
  }, [currentUser]);

  const loadRecentActivity = async () => {
    if (!currentUser) return;

    try {
      // Load recent job applications
      const applicationsResult = await queryDocuments('jobApplications', [
        { field: 'companyId', operator: '==', value: currentUser.uid }
      ], { field: 'appliedAt', direction: 'desc' }, 5);

      if (applicationsResult.success) {
        const activities = await Promise.all(
          applicationsResult.data.map(async (app) => {
            // Get student name
            const studentResult = await getDocument('students', app.studentId);
            const studentName = studentResult.success && studentResult.data 
              ? `${studentResult.data.firstName} ${studentResult.data.lastName}`
              : 'A student';

            // Get job title
            const jobResult = await getDocument('jobs', app.jobId);
            const jobTitle = jobResult.success && jobResult.data 
              ? jobResult.data.title
              : 'a position';

            return {
              key: app.id,
              title: `${studentName} applied for ${jobTitle}`,
              description: `Match score: ${app.matchScore || 0}%`,
              time: new Date(app.appliedAt).toLocaleDateString(),
              icon: Users,
              color: '#3b82f6',
              background: '#f7eae1d4'
            };
          })
        );
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      animation: 'fadeIn 0.5s ease-out'
    },
    welcomeSection: {
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      borderRadius: '1rem',
      padding: '2rem',
      color: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    welcomeBlob1: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '16rem',
      height: '16rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      marginRight: '-8rem',
      marginTop: '-8rem'
    },
    welcomeBlob2: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '12rem',
      height: '12rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      marginLeft: '-6rem',
      marginBottom: '-6rem'
    },
    welcomeContent: {
      position: 'relative'
    },
    welcomeTitle: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    welcomeSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1.125rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #fed7aa',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-0.25rem)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    statIcon: {
      width: '3rem',
      height: '3rem',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statNumber: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    statLabel: {
      color: '#4b5563',
      fontWeight: 500
    },
    statTrend: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    recentActivity: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '0.75rem'
    },
    activityIcon: {
      width: '2.5rem',
      height: '2.5rem',
      backgroundColor: '#3b82f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    activityContent: {
      flex: 1
    },
    activityTitle: {
      fontWeight: 600,
      color: '#1f2937'
    },
    activityDescription: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    activityTime: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    quickActions: {
      marginTop: '2rem'
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    quickActionCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textAlign: 'left'
    },
    quickActionCardHover: {
      transform: 'translateY(-0.5rem)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    quickActionIcon: {
      width: '4rem',
      height: '4rem',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem',
      transition: 'transform 0.3s ease'
    },
    quickActionIconHover: {
      transform: 'scale(1.1)'
    },
    quickActionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    quickActionText: {
      color: '#6b7280'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    statCards: {},
    quickActionCards: {},
    quickActionIcons: {}
  });

  const handleMouseEnter = (item, type) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: { ...prev[type], [item]: true }
    }));
  };

  const handleMouseLeave = (item, type) => {
    setHoverStates(prev => ({
      ...prev,
      [type]: { ...prev[type], [item]: false }
    }));
  };

  const statCards = [
    { 
      key: 'activeJobs', 
      number: stats.activeJobs, 
      label: 'Active Job Posts', 
      icon: Briefcase, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#16a34a', text: 'Active positions' }
    },
    { 
      key: 'totalApplicants', 
      number: stats.totalApplicants, 
      label: 'Total Applicants', 
      icon: Users, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#2563eb', text: 'All applications' }
    },
    { 
      key: 'shortlisted', 
      number: stats.shortlisted, 
      label: 'Shortlisted', 
      icon: Users, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#16a34a', text: 'Ready to review' }
    },
    { 
      key: 'invitationsSent', 
      number: stats.invitationsSent, 
      label: 'Invitations Sent', 
      icon: Send, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#ea580c', text: 'Interview invites' }
    }
  ];

  const quickActions = [
    {
      key: 'postJob',
      title: 'Post New Job',
      text: 'Create and publish a new job opening',
      icon: Plus,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('postJob')
    },
    {
      key: 'applicants',
      title: 'Review Applicants',
      text: 'Browse and review candidate applications',
      icon: Users,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('applicants')
    },
    {
      key: 'invitations',
      title: 'Send Invitations',
      text: 'Invite candidates for interviews',
      icon: Send,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('invitations')
    }
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div style={styles.welcomeBlob1}></div>
        <div style={styles.welcomeBlob2}></div>
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>Welcome back! </h1>
          <p style={styles.welcomeSubtitle}>{companyData.name || 'Company Portal'}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              style={{
                ...styles.statCard,
                ...(hoverStates.statCards[stat.key] && styles.statCardHover)
              }}
              onMouseEnter={() => handleMouseEnter(stat.key, 'statCards')}
              onMouseLeave={() => handleMouseLeave(stat.key, 'statCards')}
            >
              <div style={styles.statHeader}>
                <div style={{ ...styles.statIcon, background: stat.gradient }}>
                  <Icon size={24} color={stat.iconColor} />
                </div>
                <span style={styles.statNumber}>{stat.number}</span>
              </div>
              <p style={styles.statLabel}>{stat.label}</p>
              <div style={{ ...styles.statTrend, color: stat.trend.color }}>
                <TrendingUp size={16} />
                <span>{stat.trend.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={styles.recentActivity}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.key}
                  style={{
                    ...styles.activityItem,
                    background: activity.background
                  }}
                >
                  <div style={{ ...styles.activityIcon, backgroundColor: activity.color }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div style={styles.activityContent}>
                    <p style={styles.activityTitle}>{activity.title}</p>
                    <p style={styles.activityDescription}>{activity.description}</p>
                  </div>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickActionsGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                onClick={action.onClick}
                style={{
                  ...styles.quickActionCard,
                  ...(hoverStates.quickActionCards[action.key] && styles.quickActionCardHover)
                }}
                onMouseEnter={() => handleMouseEnter(action.key, 'quickActionCards')}
                onMouseLeave={() => handleMouseLeave(action.key, 'quickActionCards')}
              >
                <div
                  style={{
                    ...styles.quickActionIcon,
                    background: action.gradient,
                    ...(hoverStates.quickActionIcons[action.key] && styles.quickActionIconHover)
                  }}
                  onMouseEnter={() => handleMouseEnter(action.key, 'quickActionIcons')}
                  onMouseLeave={() => handleMouseLeave(action.key, 'quickActionIcons')}
                >
                  <Icon size={32} color="white" />
                </div>
                <h3 style={styles.quickActionTitle}>{action.title}</h3>
                <p style={styles.quickActionText}>{action.text}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Updated ProfilePage with Firebase integration
const ProfilePage = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    contactEmail: '',
    website: '',
    description: ''
  });

  useEffect(() => {
    loadCompanyProfile();
  }, [currentUser]);

  const loadCompanyProfile = async () => {
    if (currentUser) {
      const result = await getDocument('companies', currentUser.uid);
      if (result.success && result.data) {
        setFormData({
          name: result.data.name || '',
          industry: result.data.industry || '',
          location: result.data.location || '',
          contactEmail: result.data.contactEmail || '',
          website: result.data.website || '',
          description: result.data.description || ''
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        ...formData,
        email: currentUser.email,
        lastUpdated: new Date().toISOString()
      };

      const existingProfile = await getDocument('companies', currentUser.uid);
      
      let result;
      if (existingProfile.success && existingProfile.data) {
        result = await updateDocument('companies', currentUser.uid, profileData);
      } else {
        result = await createDocument('companies', { ...profileData, id: currentUser.uid });
      }

      if (result.success) {
        setSuccess('Company profile saved successfully!');
        if (refreshData) refreshData();
      } else {
        setError('Failed to save profile: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    }

    setLoading(false);
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      animation: 'fadeIn 0.5s ease-out'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    message: {
      padding: '0.75rem',
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    errorMessage: {
      padding: '0.75rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.875rem'
    },
    input: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    textarea: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'all 0.3s ease'
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
      alignSelf: 'flex-start'
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    }
  };

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Company Profile</h2>
      {success && <div style={styles.message}>{success}</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Company Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Company Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(buttonHover && styles.buttonHover),
            ...(loading && styles.buttonDisabled)
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

// Updated PostJobPage with Firebase integration
const PostJobPage = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    qualifications: '',
    salary: '',
    deadline: '',
    location: 'Maseru, Lesotho',
    type: 'Full-time',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const jobData = {
        ...formData,
        companyId: currentUser.uid,
        createdAt: new Date().toISOString(),
        salary: {
          min: parseInt(formData.salary.split('-')[0]?.replace('M', '').replace(',', '').trim()) || 0,
          max: parseInt(formData.salary.split('-')[1]?.replace('M', '').replace(',', '').trim()) || 0
        },
        requirements: {
          education: 'Bachelor Degree',
          minCGPA: 3.0,
          experience: '2+ years',
          skills: formData.requirements.split(',').map(s => s.trim()).filter(s => s)
        }
      };

      const result = await createDocument('jobs', jobData);

      if (result.success) {
        setMessage('Job posted successfully!');
        setFormData({
          title: '',
          description: '',
          requirements: '',
          qualifications: '',
          salary: '',
          deadline: '',
          location: 'Maseru, Lesotho',
          type: 'Full-time',
          status: 'active'
        });
        if (refreshData) refreshData();
      } else {
        setMessage('Failed to post job: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Failed to post job: ' + error.message);
    }

    setLoading(false);
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      animation: 'fadeIn 0.5s ease-out'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    message: {
      padding: '0.75rem',
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    errorMessage: {
      padding: '0.75rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.875rem'
    },
    input: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    select: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    textarea: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.3s ease'
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
      alignSelf: 'flex-start'
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    }
  };

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Post New Job</h2>
      {message && (
        <div style={message.includes('Failed') ? styles.errorMessage : styles.message}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g., Senior Software Developer"
            required
          />
        </div>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., M15,000 - M20,000"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Qualifications & Requirements</label>
          <textarea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="List the required qualifications, skills, and experience..."
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Required Skills (comma separated)</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="JavaScript, React, Node.js, Python..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(buttonHover && styles.buttonHover),
            ...(loading && styles.buttonDisabled)
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

// Updated ApplicantsPage with real data
const ApplicantsPage = ({ stats }) => {
  const { currentUser } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    loadApplicants();
  }, [currentUser]);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const applicationsResult = await queryDocuments('jobApplications', [
        { field: 'companyId', operator: '==', value: currentUser.uid }
      ]);

      if (applicationsResult.success) {
        const applicantsWithDetails = await Promise.all(
          applicationsResult.data.map(async (app) => {
            // Get student details
            const studentResult = await getDocument('students', app.studentId);
            const student = studentResult.success ? studentResult.data : null;
            
            // Get job details
            const jobResult = await getDocument('jobs', app.jobId);
            const job = jobResult.success ? jobResult.data : null;

            return {
              id: app.id,
              name: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
              qualification: student?.graduationInfo?.graduated ? 'Graduate' : 'Student',
              course: student?.graduationInfo?.graduated ? 'Graduated' : 'Current Student',
              status: app.status || 'pending',
              gpa: student?.graduationInfo?.cgpa || 'N/A',
              experience: student?.workExperience?.length > 0 ? `${student.workExperience.length} positions` : 'No experience',
              certificates: student?.skills || [],
              matchScore: app.matchScore || 0,
              studentData: student,
              jobData: job
            };
          })
        );
        setApplicants(applicantsWithDetails);
      }
    } catch (error) {
      console.error('Error loading applicants:', error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const result = await updateDocument('jobApplications', applicantId, {
        status: newStatus
      });

      if (result.success) {
        // Update local state
        setApplicants(prev => prev.map(app => 
          app.id === applicantId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    if (filter === 'all') return true;
    return applicant.status.toLowerCase() === filter;
  });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      animation: 'fadeIn 0.5s ease-out'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    badge: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f3e8ff',
      color: '#7c3aed',
      borderRadius: '9999px',
      fontWeight: 600
    },
    filters: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    filterButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    filterButtonActive: {
      backgroundColor: '#f97316',
      color: 'white',
      borderColor: '#f97316'
    },
    applicantsGrid: {
      display: 'grid',
      gap: '1rem'
    },
    applicantCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    applicantCardHover: {
      transform: 'translateY(-0.25rem)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    applicantHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    applicantName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.25rem'
    },
    applicantDetails: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '0.5rem'
    },
    matchScore: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600
    },
    statusShortlisted: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    statusPending: {
      backgroundColor: '#dbeafe',
      color: '#2563eb'
    },
    statusRejected: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    actions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.3s ease'
    },
    buttonShortlist: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    buttonReject: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  };

  const [hoverStates, setHoverStates] = useState({});

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid #fed7aa',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2>Loading applicants...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        border: '1px solid #fed7aa',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={styles.header}>
          <h2 style={styles.title}>Job Applicants</h2>
          <span style={styles.badge}>{stats.totalApplicants} Total Applicants</span>
        </div>

        <div style={styles.filters}>
          {['all', 'pending', 'shortlisted', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                ...styles.filterButton,
                ...(filter === status && styles.filterButtonActive)
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.applicantsGrid}>
          {filteredApplicants.map(applicant => (
            <div
              key={applicant.id}
              style={{
                ...styles.applicantCard,
                ...(hoverStates[applicant.id] && styles.applicantCardHover)
              }}
              onMouseEnter={() => setHoverStates(prev => ({ ...prev, [applicant.id]: true }))}
              onMouseLeave={() => setHoverStates(prev => ({ ...prev, [applicant.id]: false }))}
              onClick={() => setSelectedApplicant(applicant)}
            >
              <div style={styles.applicantHeader}>
                <div>
                  <h3 style={styles.applicantName}>{applicant.name}</h3>
                  <p style={styles.applicantDetails}>
                    {applicant.qualification} • GPA: {applicant.gpa} • {applicant.experience}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {applicant.certificates.slice(0, 3).map((cert, index) => (
                      <span key={index} style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#374151'
                      }}>
                        {cert}
                      </span>
                    ))}
                    {applicant.certificates.length > 3 && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#374151'
                      }}>
                        +{applicant.certificates.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={styles.matchScore}>{applicant.matchScore}% Match</span>
                  <span style={{
                    ...styles.statusBadge,
                    ...styles[`status${applicant.status}`]
                  }}>
                    {applicant.status}
                  </span>
                </div>
              </div>
              
              <div style={styles.actions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(applicant.id, 'shortlisted');
                  }}
                  style={{ ...styles.actionButton, ...styles.buttonShortlist }}
                >
                  <CheckCircle size={16} style={{ marginRight: '0.25rem' }} />
                  Shortlist
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(applicant.id, 'rejected');
                  }}
                  style={{ ...styles.actionButton, ...styles.buttonReject }}
                >
                  <XCircle size={16} style={{ marginRight: '0.25rem' }} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No applicants found for the selected filter.
          </div>
        )}
      </div>

      {selectedApplicant && (
        <div style={styles.modal} onClick={() => setSelectedApplicant(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.applicantName}>{selectedApplicant.name}</h3>
            <p style={styles.applicantDetails}>
              {selectedApplicant.qualification} in {selectedApplicant.course}
            </p>
            <p>GPA: {selectedApplicant.gpa}</p>
            <p>Experience: {selectedApplicant.experience}</p>
            <p>Skills: {selectedApplicant.certificates.join(', ')}</p>
            <p>Match Score: {selectedApplicant.matchScore}%</p>
            <p>Status: {selectedApplicant.status}</p>
            <button 
              onClick={() => setSelectedApplicant(null)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated InvitationsPage with real data
// Updated InvitationsPage with companyData
const InvitationsPage = ({ refreshData, companyData }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    applicantEmail: '',
    message: '',
    date: '',
    time: '',
    position: '' ,
    location:'Office-To be confirmed'
    
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sentInvitations, setSentInvitations] = useState([]);

  useEffect(() => {
    loadInvitations();
  }, [currentUser]);

 const loadInvitations = async () => {
  try {
    const result = await queryDocuments('invitations', [
      { field: 'companyId', operator: '==', value: currentUser.uid }
    ]);

    if (result.success) {
      // Sort in JavaScript
      const sortedInvitations = result.data.sort((a, b) => 
        new Date(b.sentAt) - new Date(a.sentAt)
      );
      setSentInvitations(sortedInvitations);
    }
  } catch (error) {
    console.error('Error loading invitations:', error);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    // Get company data first
    const companyResult = await getDocument('companies', currentUser.uid);
    const companyName = companyResult.success && companyResult.data 
      ? companyResult.data.name 
      : 'Our Company';

    const invitationData = {
      applicantEmail: formData.applicantEmail,  
      position: formData.position,
      message: formData.message,
      date: formData.date,
      time: formData.time,
      location: formData.location || 'To be confirmed',
      companyId: currentUser.uid,
      companyName: companyName,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    const result = await createDocument('invitations', invitationData);

    if (result.success) {
      setMessage('Invitation sent successfully!');
      setFormData({
        applicantEmail: '',
        message: '',
        date: '',
        time: '',
        position: '',
        location: ''
      });
      await loadInvitations();
      if (refreshData) refreshData();
    } else {
      setMessage('Failed to send invitation: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    setMessage('Failed to send invitation: ' + error.message);
  }

  setLoading(false);
};
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      animation: 'fadeIn 0.5s ease-out'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    invitationsCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    message: {
      padding: '0.75rem',
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    errorMessage: {
      padding: '0.75rem',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '0.875rem'
    },
    input: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    textarea: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.3s ease'
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      borderRadius: '0.5rem',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
      alignSelf: 'flex-start'
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    invitationsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    invitationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0'
    },
    invitationDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    invitationEmail: {
      fontWeight: '600',
      color: '#1f2937'
    },
    invitationMeta: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    statusAccepted: {
      backgroundColor: '#dcfce7',
      color: '#16a34a'
    },
    statusDeclined: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    }
  };

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Send Interview Invitation</h2>
        {message && (
          <div style={message.includes('Failed') ? styles.errorMessage : styles.message}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Applicant Email</label>
              <input
                type="email"
                name="applicantEmail"
                placeholder="applicant@email.com"
                value={formData.applicantEmail}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Position</label>
              <input
                type="text"
                name="position"
                placeholder="e.g., Senior Developer"
                value={formData.position}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Interview Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Main Office, Conference Room A"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Interview Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Interview Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Invitation Message</label>
            <textarea
              name="message"
              placeholder="Dear applicant, we are pleased to invite you for an interview..."
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(buttonHover && styles.buttonHover),
              ...(loading && styles.buttonDisabled)
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            <Send size={16} style={{ marginRight: '0.5rem' }} />
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      <div style={styles.invitationsCard}>
        <h3 style={styles.title}>Sent Invitations</h3>
        <div style={styles.invitationsList}>
          {sentInvitations.length > 0 ? (
            sentInvitations.map(invitation => (
              <div key={invitation.id} style={styles.invitationItem}>
                <div style={styles.invitationDetails}>
                  <span style={styles.invitationEmail}>{invitation.applicantEmail}</span>
                  <span style={styles.invitationMeta}>
                    {invitation.position} • {invitation.date} at {invitation.time}
                  </span>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  ...styles[`status${invitation.status}`]
                }}>
                  {invitation.status}
                </span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No invitations sent yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;