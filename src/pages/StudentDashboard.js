// src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocument } from '../firebase/helpers';

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

  // Inline styles matching orange-pink theme
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbeb, #fef2f2, #fffbeb)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    sidebar: {
      width: '280px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    sidebarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(236, 72, 153, 0.9))',
      zIndex: 1
    },
    sidebarContent: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    logo: {
      padding: '30px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.2)'
    },
    logoText: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #fff, #ffedd5)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    logoSubtext: {
      margin: '5px 0 0 0',
      fontSize: '14px',
      opacity: 0.9,
      color: '#ffedd5'
    },
    nav: {
      flex: 1,
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      color: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontSize: '15px',
      cursor: 'pointer',
      margin: '0 10px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)'
    },
    navItemHover: {
      background: 'rgba(255,255,255,0.2)',
      transform: 'translateX(5px)'
    },
    navIcon: {
      marginRight: '15px',
      fontSize: '20px',
      width: '20px',
      height: '20px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4px'
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      margin: '10px',
      borderRadius: '12px'
    },
    userInfo: {
      marginBottom: '15px'
    },
    userName: {
      margin: 0,
      fontSize: '14px',
      fontWeight: '600',
      color: 'white'
    },
    userRole: {
      margin: '5px 0 0 0',
      fontSize: '12px',
      opacity: 0.8,
      color: '#ffedd5'
    },
    logoutBtn: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
    },
    logoutBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
    },
    mainContent: {
      flex: 1,
      overflow: 'auto',
      padding: '30px',
      background: 'linear-gradient(135deg, #fffbeb, #fef2f2, #fffbeb)',
      position: 'relative'
    },
    homeContainer: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    welcomeTitle: {
      fontSize: '36px',
      margin: '0 0 10px 0',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
    },
    welcomeSubtitle: {
      fontSize: '18px',
      color: '#4b5563',
      marginBottom: '30px',
      fontWeight: '500'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: '1px solid #fed7aa',
      transition: 'all 0.3s ease'
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      borderColor: '#fdba74'
    },
    statIcon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    statNumber: {
      fontSize: '32px',
      margin: '0 0 5px 0',
      color: '#111827',
      fontWeight: 'bold'
    },
    statLabel: {
      margin: 0,
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '500'
    },
    alertCard: {
      background: 'linear-gradient(135deg, #fffbeb, #fef2f2)',
      padding: '25px',
      borderRadius: '16px',
      marginBottom: '30px',
      border: '2px solid #fed7aa',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    alertTitle: {
      margin: '0 0 10px 0',
      color: '#c2410c',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    alertText: {
      margin: '0 0 15px 0',
      color: '#92400e',
      fontSize: '15px',
      lineHeight: '1.5'
    },
    alertButton: {
      display: 'inline-block',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    alertButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    quickLinks: {
      marginTop: '30px'
    },
    sectionTitle: {
      fontSize: '28px',
      marginBottom: '25px',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
    },
    quickLinksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px'
    },
    quickLinkCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #fed7aa',
      position: 'relative',
      overflow: 'hidden'
    },
    quickLinkCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      borderColor: '#fdba74'
    },
    quickLinkCardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(236, 72, 153, 0.1))',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    quickLinkCardOverlayHover: {
      opacity: 1
    },
    quickLinkIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    quickLinkTitle: {
      margin: '0 0 12px 0',
      color: '#111827',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    quickLinkText: {
      margin: 0,
      color: '#6b7280',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    blob1: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '200px',
      height: '200px',
      background: '#fdba74',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: 0.2,
      animation: 'blob 7s infinite'
    },
    blob2: {
      position: 'absolute',
      bottom: '10%',
      right: '5%',
      width: '150px',
      height: '150px',
      background: '#f9a8d4',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: 0.2,
      animation: 'blob 7s infinite 2s'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    navItems: {},
    logoutBtn: false,
    alertButton: false,
    quickLinks: {},
    statCards: {}
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
      {/* Background blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarOverlay}></div>
        <div style={styles.sidebarContent}>
          <div style={styles.logo}>
            <h2 style={styles.logoText}>CareerSide</h2>
            <p style={styles.logoSubtext}>Student Dashboard</p>
          </div>

          <nav style={styles.nav}>
            {['home', 'profile', 'courses', 'applications', 'documents', 'jobs'].map((tab) => (
              <Link 
                key={tab}
                to={`/student${tab === 'home' ? '' : '/' + tab}`} 
                style={{
                  ...styles.navItem,
                  ...(hoverStates.navItems[tab] && styles.navItemHover)
                }}
                onClick={() => setActiveTab(tab)}
                onMouseEnter={() => handleMouseEnter(tab, 'navItems')}
                onMouseLeave={() => handleMouseLeave(tab, 'navItems')}
              >
                <span style={styles.navIcon}></span>
                <span>
                  {tab === 'home' && 'Home'}
                  {tab === 'profile' && 'My Profile'}
                  {tab === 'courses' && 'Browse Courses'}
                  {tab === 'applications' && 'My Applications'}
                  {tab === 'documents' && 'Upload Documents'}
                  {tab === 'jobs' && 'Job Opportunities'}
                </span>
              </Link>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{userData?.email || 'Student'}</p>
              <p style={styles.userRole}>Student</p>
            </div>
            <button 
              onClick={handleLogout} 
              style={{
                ...styles.logoutBtn,
                ...(hoverStates.logoutBtn && styles.logoutBtnHover)
              }}
              onMouseEnter={() => handleMouseEnter('logoutBtn', 'logoutBtn')}
              onMouseLeave={() => handleMouseLeave('logoutBtn', 'logoutBtn')}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<StudentHome studentData={studentData} styles={styles} hoverStates={hoverStates} setHoverStates={setHoverStates} />} />
          <Route path="/profile" element={<StudentProfile refreshData={refreshData} />} />
          <Route path="/browse-courses" element={<BrowseCourses studentData={studentData} />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/documents" element={<UploadDocuments refreshData={refreshData} />} />
          <Route path="/jobs" element={<BrowseJobs studentData={studentData} />} />
        </Routes>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

// Home Component
const StudentHome = ({ studentData, styles, hoverStates, setHoverStates }) => {
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

  const quickLinks = [
    { key: 'courses', title: 'Browse Courses', text: 'Explore available programs', path: '/student/browse-courses' },
    { key: 'applications', title: 'My Applications', text: 'Track your applications', path: '/student/applications' },
    { key: 'jobs', title: 'Find Jobs', text: 'Browse opportunities', path: '/student/jobs' }
  ];

  const stats = [
    { key: 'applications', number: '0', label: 'Active Applications', icon: '📝' },
    { key: 'admitted', number: '0', label: 'Admitted', icon: '✅' },
    { key: 'jobs', number: '0', label: 'Job Applications', icon: '💼' },
    { key: 'profile', number: studentData?.profileCompleted ? '100%' : '20%', label: 'Profile Complete', icon: '📊' }
  ];

  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.welcomeTitle}>
        Welcome back! 
      </h1>
      <p style={styles.welcomeSubtitle}>
        {studentData?.firstName ? `${studentData.firstName} ${studentData.lastName}` : 'Complete your profile to get started'}
      </p>

      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div 
            key={stat.key}
            style={{
              ...styles.statCard,
              ...(hoverStates.statCards[stat.key] && styles.statCardHover)
            }}
            onMouseEnter={() => handleMouseEnter(stat.key, 'statCards')}
            onMouseLeave={() => handleMouseLeave(stat.key, 'statCards')}
          >
            <div style={styles.statIcon}>
              {stat.icon}
            </div>
            <div>
              <h3 style={styles.statNumber}>{stat.number}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {!studentData?.firstName && (
        <div style={styles.alertCard}>
          <h3 style={styles.alertTitle}>Complete Your Profile</h3>
          <p style={styles.alertText}>
            Please complete your profile to start applying for courses and jobs.
          </p>
          <Link 
            to="/student/profile" 
            style={{
              ...styles.alertButton,
              ...(hoverStates.alertButton && styles.alertButtonHover)
            }}
            onMouseEnter={() => handleMouseEnter('alertButton', 'alertButton')}
            onMouseLeave={() => handleMouseLeave('alertButton', 'alertButton')}
          >
            Complete Profile Now
          </Link>
        </div>
      )}

      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickLinksGrid}>
          {quickLinks.map((link) => (
            <Link 
              key={link.key}
              to={link.path} 
              style={{
                ...styles.quickLinkCard,
                ...(hoverStates.quickLinks[link.key] && styles.quickLinkCardHover)
              }}
              onMouseEnter={() => handleMouseEnter(link.key, 'quickLinks')}
              onMouseLeave={() => handleMouseLeave(link.key, 'quickLinks')}
            >
              <div style={{
                ...styles.quickLinkCardOverlay,
                ...(hoverStates.quickLinks[link.key] && styles.quickLinkCardOverlayHover)
              }}></div>
              <span style={styles.quickLinkIcon}>→</span>
              <h3 style={styles.quickLinkTitle}>{link.title}</h3>
              <p style={styles.quickLinkText}>{link.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    educationLevel: '',
    institution: '',
    fieldOfStudy: '',
    graduationYear: '',
    skills: '',
    interests: '',
    careerGoals: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const result = await getDocument('students', currentUser.uid);
        if (result.success && result.data) {
          setFormData({
            firstName: result.data.firstName || '',
            lastName: result.data.lastName || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            dateOfBirth: result.data.dateOfBirth || '',
            gender: result.data.gender || '',
            educationLevel: result.data.educationLevel || '',
            institution: result.data.institution || '',
            fieldOfStudy: result.data.fieldOfStudy || '',
            graduationYear: result.data.graduationYear || '',
            skills: result.data.skills || '',
            interests: result.data.interests || '',
            careerGoals: result.data.careerGoals || ''
          });
        }
      } catch (error) {
        console.error('Error loading student data:', error);
        setMessage('Error loading profile data');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setMessage('');

    try {
      const profileData = {
        ...formData,
        profileCompleted: true,
        lastUpdated: new Date().toISOString()
      };

      const result = await updateDocument('students', currentUser.uid, profileData);
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        if (refreshData) {
          refreshData();
        }
      } else {
        setMessage('Error updating profile: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '32px',
      margin: '0 0 10px 0',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0
    },
    form: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
    },
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '20px',
      color: '#111827',
      marginBottom: '20px',
      fontWeight: '600',
      borderBottom: '2px solid #fed7aa',
      paddingBottom: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white'
    },
    inputFocus: {
      borderColor: '#f97316',
      boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    button: {
      padding: '14px 30px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    message: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    successMessage: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280'
    }
  };

  const [focusedField, setFocusedField] = useState(null);
  const [buttonHover, setButtonHover] = useState(false);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h3>Loading profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Profile</h1>
        <p style={styles.subtitle}>
          Complete your profile to enhance your career opportunities
        </p>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('Error') ? styles.errorMessage : styles.successMessage)
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Information</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  ...styles.input,
                  ...(focusedField === 'firstName' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  ...styles.input,
                  ...(focusedField === 'lastName' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === 'phone' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onFocus={() => setFocusedField('dateOfBirth')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.input,
                  ...(focusedField === 'dateOfBirth' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onFocus={() => setFocusedField('gender')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.select,
                  ...(focusedField === 'gender' && styles.inputFocus)
                }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your full address"
              style={{
                ...styles.textarea,
                ...(focusedField === 'address' && styles.inputFocus)
              }}
            />
          </div>
        </div>

        {/* Education Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Education Information</h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Education Level</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                onFocus={() => setFocusedField('educationLevel')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...styles.select,
                  ...(focusedField === 'educationLevel' && styles.inputFocus)
                }}
              >
                <option value="">Select Education Level</option>
                <option value="high-school">High School</option>
                <option value="diploma">Diploma</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                onFocus={() => setFocusedField('institution')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your school/university"
                style={{
                  ...styles.input,
                  ...(focusedField === 'institution' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Field of Study</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                onFocus={() => setFocusedField('fieldOfStudy')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your major/course of study"
                style={{
                  ...styles.input,
                  ...(focusedField === 'fieldOfStudy' && styles.inputFocus)
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                onFocus={() => setFocusedField('graduationYear')}
                onBlur={() => setFocusedField(null)}
                placeholder="YYYY"
                min="1900"
                max="2030"
                style={{
                  ...styles.input,
                  ...(focusedField === 'graduationYear' && styles.inputFocus)
                }}
              />
            </div>
          </div>
        </div>

        {/* Skills & Career */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Skills & Career Goals</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onFocus={() => setFocusedField('skills')}
              onBlur={() => setFocusedField(null)}
              placeholder="List your skills (separated by commas)"
              style={{
                ...styles.textarea,
                ...(focusedField === 'skills' && styles.inputFocus)
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Interests</label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              onFocus={() => setFocusedField('interests')}
              onBlur={() => setFocusedField(null)}
              placeholder="Your professional interests"
              style={{
                ...styles.textarea,
                ...(focusedField === 'interests' && styles.inputFocus)
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Career Goals</label>
            <textarea
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleChange}
              onFocus={() => setFocusedField('careerGoals')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe your career aspirations and goals"
              style={{
                ...styles.textarea,
                ...(focusedField === 'careerGoals' && styles.inputFocus)
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...styles.button,
            ...(buttonHover && styles.buttonHover),
            ...(saving && styles.buttonDisabled)
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

// Placeholder components for other routes
const BrowseCourses = ({ studentData }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #dc2626, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold'
      }}>
        Browse Courses
      </h1>
      <p>Course browsing functionality coming soon...</p>
    </div>
  );
};

const MyApplications = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #dc2626, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold'
      }}>
        My Applications
      </h1>
      <p>Application tracking functionality coming soon...</p>
    </div>
  );
};

const UploadDocuments = ({ refreshData }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #dc2626, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold'
      }}>
        Upload Documents
      </h1>
      <p>Document upload functionality coming soon...</p>
    </div>
  );
};

const BrowseJobs = ({ studentData }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #dc2626, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold'
      }}>
        Job Opportunities
      </h1>
      <p>Job browsing functionality coming soon...</p>
    </div>
  );
};

// Mock firebase helper function (replace with actual implementation)
const updateDocument = async (collection, docId, data) => {
  // This is a mock implementation - replace with your actual Firebase update function
  console.log('Updating document:', collection, docId, data);
  return { success: true };
};

export default StudentDashboard;