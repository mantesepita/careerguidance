// src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocument, queryDocuments, createDocument, updateDocument, canStudentApply, calculateJobMatchScore, uploadFile } from '../firebase/helpers';
import { BookOpen, Briefcase, FileText, User, Home, LogOut, CheckCircle, XCircle, Clock, Plus, Upload, MapPin } from 'lucide-react';
import logo from './logo.png';
import Footer from './Footer';

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
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    logoIcon: {
      width: '50px',
      height: '50px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)'
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
      width: '20px',
      height: '20px'
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
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
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
      color: 'white'
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

  const navItems = [
    { key: 'home', label: 'Home', icon: Home, path: '/student' },
    { key: 'profile', label: 'My Profile', icon: User, path: '/student/profile' },
    { key: 'courses', label: 'Browse Courses', icon: BookOpen, path: '/student/browse-courses' },
    { key: 'applications', label: 'My Applications', icon: FileText, path: '/student/applications' },
    { key: 'documents', label: 'Upload Documents', icon: Upload, path: '/student/documents' },
    { key: 'jobs', label: 'Job Opportunities', icon: Briefcase, path: '/student/jobs' }
  ];

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
            <div>
              <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
            </div>
            <div>
              <h2 style={styles.logoText}>ThutoPele</h2>
              <p style={styles.logoSubtext}>Student Dashboard</p>
            </div>
          </div>

          <nav style={styles.nav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.key}
                  to={item.path} 
                  style={{
                    ...styles.navItem,
                    ...(hoverStates.navItems[item.key] && styles.navItemHover)
                  }}
                  onClick={() => setActiveTab(item.key)}
                  onMouseEnter={() => handleMouseEnter(item.key, 'navItems')}
                  onMouseLeave={() => handleMouseLeave(item.key, 'navItems')}
                >
                  <Icon size={20} style={styles.navIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.userInfo}>
              <p style={styles.userName}>
                {studentData?.firstName ? `${studentData.firstName} ${studentData.lastName}` : userData?.email}
              </p>
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
              <LogOut size={16} />
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
  const [stats, setStats] = useState({
    applications: 0,
    admitted: 0,
    jobs: 0,
    profile: '0%'
  });

  useEffect(() => {
    loadStats();
  }, [studentData]);

  const loadStats = async () => {
    if (!studentData) return;

    // Calculate profile completion
    const profileFields = ['firstName', 'lastName', 'phone', 'address', 'dateOfBirth'];
    const completedFields = profileFields.filter(field => studentData[field]);
    const profileCompletion = Math.round((completedFields.length / profileFields.length) * 100);

    setStats(prev => ({
      ...prev,
      profile: `${profileCompletion}%`
    }));
  };

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
    { 
      key: 'courses', 
      title: 'Browse Courses', 
      text: 'Explore available programs and apply online', 
      path: '/student/browse-courses',
      icon: BookOpen
    },
    { 
      key: 'applications', 
      title: 'My Applications', 
      text: 'Track your course applications and admission status', 
      path: '/student/applications',
      icon: FileText
    },
    { 
      key: 'jobs', 
      title: 'Find Jobs', 
      text: 'Browse job opportunities matching your profile', 
      path: '/student/jobs',
      icon: Briefcase
    }
  ];

  const statItems = [
    { key: 'applications', number: stats.applications, label: 'Active Applications', icon: FileText },
    { key: 'admitted', number: stats.admitted, label: 'Admitted', icon: CheckCircle },
    { key: 'jobs', number: stats.jobs, label: 'Job Applications', icon: Briefcase },
    { key: 'profile', number: stats.profile, label: 'Profile Complete', icon: User }
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
        {statItems.map((stat) => {
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
              <div style={styles.statIcon}>
                <Icon size={24} />
              </div>
              <div>
                <h3 style={styles.statNumber}>{stat.number}</h3>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {!studentData?.firstName && (
        <div style={styles.alertCard}>
          <h3 style={styles.alertTitle}>Complete Your Profile</h3>
          <p style={styles.alertText}>
            Please complete your profile to start applying for courses and jobs. You'll need to provide your personal information and high school qualifications.
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

      {studentData?.graduationInfo?.graduated && (
        <div style={styles.alertCard}>
          <h3 style={styles.alertTitle}>Ready for Job Opportunities! 🚀</h3>
          <p style={styles.alertText}>
            You've graduated and uploaded your documents. Start browsing job opportunities that match your qualifications.
          </p>
          <Link 
            to="/student/jobs" 
            style={{
              ...styles.alertButton,
              ...(hoverStates.alertButton && styles.alertButtonHover)
            }}
            onMouseEnter={() => handleMouseEnter('alertButton', 'alertButton')}
            onMouseLeave={() => handleMouseLeave('alertButton', 'alertButton')}
          >
            Browse Jobs
          </Link>
        </div>
      )}

      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickLinksGrid}>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
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
                <div style={styles.quickLinkIcon}>
                  <Icon size={28} />
                </div>
                <h3 style={styles.quickLinkTitle}>{link.title}</h3>
                <p style={styles.quickLinkText}>{link.text}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    highSchool: {
      name: '',
      graduationYear: '',
      points: '',
      subjects: ''
    }
  });

  useEffect(() => {
    loadStudentProfile();
  }, [currentUser]);

  const loadStudentProfile = async () => {
    if (currentUser) {
      const result = await getDocument('students', currentUser.uid);
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          ...result.data,
          highSchool: {
            ...prev.highSchool,
            ...result.data.highSchool,
            subjects: Array.isArray(result.data.highSchool?.subjects) 
              ? result.data.highSchool.subjects.join(', ') 
              : result.data.highSchool?.subjects || ''
          }
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse subjects string into array
      const subjectsArray = formData.highSchool.subjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const profileData = {
        ...formData,
        highSchool: {
          ...formData.highSchool,
          points: parseInt(formData.highSchool.points) || 0,
          graduationYear: parseInt(formData.highSchool.graduationYear) || new Date().getFullYear(),
          subjects: subjectsArray
        },
        currentStatus: 'seeking-admission',
        profileCompleted: true,
        lastUpdated: new Date().toISOString()
      };

      // Check if profile exists
      const existingProfile = await getDocument('students', currentUser.uid);
      
      let result;
      if (existingProfile.success && existingProfile.data) {
        // Update existing profile
        result = await updateDocument('students', currentUser.uid, profileData);
      } else {
        // Create new profile
        result = await createDocument('students', { ...profileData, id: currentUser.uid });
      }

      if (result.success) {
        setSuccess('✅ Profile saved successfully!');
        if (refreshData) refreshData();
      } else {
        setError('❌ Failed to save profile: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setError('❌ Failed to save profile: ' + err.message);
    }

    setLoading(false);
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    title: {
      fontSize: '32px',
      margin: '0 0 10px 0',
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
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
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
    },
    section: {
      marginBottom: '35px',
      paddingBottom: '35px',
      borderBottom: '1px solid #e9ecef'
    },
    sectionTitle: {
      fontSize: '20px',
      marginBottom: '20px',
      color: '#2c3e50',
      fontWeight: '600',
      borderBottom: '2px solid #fed7aa',
      paddingBottom: '10px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    helpText: {
      color: '#7f8c8d',
      fontSize: '12px',
      marginTop: '5px',
      display: 'block'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    }
  };

  const [buttonHover, setButtonHover] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Student Profile</h1>
      <p style={styles.subtitle}>Complete your profile to start applying for courses</p>

      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Personal Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter first name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ID Number *</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter ID number"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="+266-5800-0000"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Emergency Contact</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Name *</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter contact name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Relationship *</label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., Mother, Father"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Phone *</label>
            <input
              type="tel"
              name="emergencyContact.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="+266-5800-0000"
            />
          </div>
        </div>

        {/* High School Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>High School Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>High School Name *</label>
              <input
                type="text"
                name="highSchool.name"
                value={formData.highSchool.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter high school name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Graduation Year *</label>
              <input
                type="number"
                name="highSchool.graduationYear"
                value={formData.highSchool.graduationYear}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., 2023"
                min="1990"
                max="2030"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Total Points *</label>
            <input
              type="number"
              name="highSchool.points"
              value={formData.highSchool.points}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter total points (0-50)"
              min="0"
              max="50"
            />
            <small style={styles.helpText}>Your total high school points</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Subjects & Grades *</label>
            <textarea
              name="highSchool.subjects"
              value={formData.highSchool.subjects}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Enter subjects and grades separated by commas&#10;Example: Mathematics: A, English: B, Physics: C"
              rows="4"
            />
            <small style={styles.helpText}>Separate each subject with a comma</small>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.submitButton,
            ...(buttonHover && styles.submitButtonHover),
            ...(loading && styles.submitButtonDisabled)
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {loading ? 'Saving...' : ' Save Profile'}
        </button>
      </form>
    </div>
  );
};

// Browse Courses Component
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
    const requiredPoints = course.requirements?.minimumPoints || 0;

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
          overallGrade: 'B+'
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
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
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
      border: '1px solid #fed7aa',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    courseCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
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
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    applyButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    applyButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    courseCards: {},
    applyButtons: {}
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
              {inst.name} {inst.acronym ? `(${inst.acronym})` : ''}
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
            <div key={course.id} style={{
              ...styles.courseCard,
              ...(hoverStates.courseCards[course.id] && styles.courseCardHover)
            }}
            onMouseEnter={() => handleMouseEnter(course.id, 'courseCards')}
            onMouseLeave={() => handleMouseLeave(course.id, 'courseCards')}>
              <div style={styles.courseHeader}>
                <h3 style={styles.courseName}>{course.courseName}</h3>
                <span style={{
                  ...styles.levelBadge,
                  backgroundColor: course.level === 'diploma' ? '#e74c3c' : '#3498db'
                }}>
                  {course.level?.toUpperCase() || 'COURSE'}
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
                  <span style={styles.detailIcon}>💰</span>
                  <span>Fees: LSL {course.fees?.toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📅</span>
                  <span>Intake: {course.intake}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📊</span>
                  <span>Min Points: {course.requirements?.minimumPoints || 'N/A'}</span>
                </div>
              </div>

              <div style={styles.requirements}>
                <h4 style={styles.requirementsTitle}>Requirements:</h4>
                <ul style={styles.requirementsList}>
                  <li>Minimum Points: {course.requirements?.minimumPoints || 'N/A'}</li>
                  <li>Required Subjects: {course.requirements?.requiredSubjects?.join(', ') || 'Any'}</li>
                  <li>Minimum Grade: {course.requirements?.minimumGrade || 'C'}</li>
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
                  ...(hoverStates.applyButtons[course.id] && styles.applyButtonHover),
                  ...((!eligibility.eligible || !studentData?.firstName) && styles.applyButtonDisabled)
                }}
                onMouseEnter={() => handleMouseEnter(course.id, 'applyButtons')}
                onMouseLeave={() => handleMouseLeave(course.id, 'applyButtons')}
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

// My Applications Component
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
      alert('❌ Failed to confirm admission: ' + error.message);
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
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
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
      border: '1px solid #fed7aa',
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
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
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '10px',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
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
                <span style={styles.detailValue}>{app.qualifications?.points || 'N/A'}</span>
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

// Upload Documents Component
const UploadDocuments = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    graduated: false,
    graduationDate: '',
    cgpa: '',
    transcript: null,
    certificates: [],
    skills: '',
    workExperience: []
  });

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    setLoading(true);
    const result = await getDocument('students', currentUser.uid);
    if (result.success) {
      setStudentData(result.data);
      if (result.data.graduationInfo) {
        setFormData({
          graduated: result.data.graduationInfo.graduated || false,
          graduationDate: result.data.graduationInfo.graduationDate || '',
          cgpa: result.data.graduationInfo.cgpa || '',
          transcript: null,
          certificates: [],
          skills: result.data.skills?.join(', ') || '',
          workExperience: result.data.workExperience || []
        });
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      let transcriptUrl = studentData?.graduationInfo?.transcript || null;
      
      // Upload transcript if selected
      if (formData.transcript) {
        const transcriptResult = await uploadFile(
          formData.transcript,
          `transcripts/${currentUser.uid}/${Date.now()}_${formData.transcript.name}`
        );
        
        if (transcriptResult.success) {
          transcriptUrl = transcriptResult.url;
        } else {
          throw new Error('Failed to upload transcript');
        }
      }

      // Parse skills
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      // Update student document
      const updateData = {
        graduationInfo: {
          graduated: formData.graduated,
          graduationDate: formData.graduationDate,
          cgpa: parseFloat(formData.cgpa) || 0,
          transcript: transcriptUrl,
          certificates: formData.certificates
        },
        skills: skillsArray,
        workExperience: formData.workExperience,
        currentStatus: formData.graduated ? 'graduated' : studentData?.currentStatus,
        lastUpdated: new Date().toISOString()
      };

      const result = await updateDocument('students', currentUser.uid, updateData);

      if (result.success) {
        setMessage({ type: 'success', text: '✅ Documents uploaded successfully!' });
        if (refreshData) refreshData();
        await loadStudentData();
      } else {
        setMessage({ type: 'error', text: `❌ ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Failed to upload: ${error.message}` });
    }

    setUploading(false);
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px'
    },
    title: {
      fontSize: '32px',
      margin: '0 0 10px 0',
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
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
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '35px',
      paddingBottom: '35px',
      borderBottom: '1px solid #e9ecef'
    },
    sectionTitle: {
      fontSize: '20px',
      marginBottom: '20px',
      color: '#2c3e50',
      fontWeight: '600',
      borderBottom: '2px solid #fed7aa',
      paddingBottom: '10px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#2c3e50',
      fontWeight: '600',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    fileInput: {
      width: '100%',
      padding: '10px',
      border: '2px dashed #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer'
    },
    helpText: {
      color: '#7f8c8d',
      fontSize: '12px',
      marginTop: '5px',
      display: 'block'
    },
    checkboxGroup: {
      marginBottom: '20px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '15px',
      color: '#2c3e50',
      cursor: 'pointer'
    },
    checkbox: {
      marginRight: '10px',
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    currentFile: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: '#d4edda',
      color: '#155724',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    viewLink: {
      color: '#155724',
      fontWeight: '600',
      textDecoration: 'underline'
    },
    experienceList: {
      marginBottom: '20px'
    },
    experienceCard: {
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '15px'
    },
    experienceTitle: {
      margin: '0 0 5px 0',
      fontSize: '16px',
      color: '#2c3e50'
    },
    experienceCompany: {
      margin: '0 0 5px 0',
      fontSize: '14px',
      color: '#555',
      fontWeight: '600'
    },
    experienceDuration: {
      margin: '0 0 10px 0',
      fontSize: '13px',
      color: '#7f8c8d'
    },
    experienceDesc: {
      margin: 0,
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.5'
    },
    infoBox: {
      padding: '15px',
      backgroundColor: '#e7f3ff',
      borderRadius: '8px',
      border: '1px solid #b3d9ff'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    },
    statusCard: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
    },
    statusTitle: {
      margin: '0 0 20px 0',
      fontSize: '20px',
      color: '#2c3e50'
    },
    statusGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    statusIcon: {
      fontSize: '24px',
      marginRight: '10px'
    },
    statusNote: {
      padding: '15px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
      margin: 0,
      textAlign: 'center',
      fontSize: '14px'
    }
  };

  const [buttonHover, setButtonHover] = useState(false);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Upload Documents</h1>
      <p style={styles.subtitle}>Upload your academic transcripts and additional certificates</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Graduation Status */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Graduation Status</h2>
          
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="graduated"
                checked={formData.graduated}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>I have graduated from my program</span>
            </label>
          </div>

          {formData.graduated && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Graduation Date *</label>
                  <input
                    type="date"
                    name="graduationDate"
                    value={formData.graduationDate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>CGPA / Overall Grade *</label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    max="4.0"
                    style={styles.input}
                    placeholder="e.g., 3.5"
                  />
                  <small style={styles.helpText}>Enter your CGPA out of 4.0</small>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Upload Academic Transcript *</label>
                <input
                  type="file"
                  name="transcript"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={styles.fileInput}
                  required={!studentData?.graduationInfo?.transcript}
                />
                <small style={styles.helpText}>
                  Accepted formats: PDF, JPG, PNG (Max 5MB)
                </small>
                {studentData?.graduationInfo?.transcript && (
                  <div style={styles.currentFile}>
                     Current transcript uploaded
                    <a 
                      href={studentData.graduationInfo.transcript} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.viewLink}
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills & Competencies</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Technical Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter your skills separated by commas&#10;Example: JavaScript, React, Node.js, Python, SQL"
              rows="4"
            />
            <small style={styles.helpText}>
              List your technical and professional skills (comma-separated)
            </small>
          </div>
        </div>

        {/* Work Experience */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Work Experience (Optional)</h2>
          
          {formData.workExperience.length > 0 && (
            <div style={styles.experienceList}>
              {formData.workExperience.map((exp, index) => (
                <div key={index} style={styles.experienceCard}>
                  <h4 style={styles.experienceTitle}>{exp.position}</h4>
                  <p style={styles.experienceCompany}>{exp.company}</p>
                  <p style={styles.experienceDuration}>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p style={styles.experienceDesc}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          <div style={styles.infoBox}>
            <p> Work experience helps match you with relevant job opportunities</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          style={{
            ...styles.submitButton,
            ...(buttonHover && styles.submitButtonHover),
            ...(uploading && styles.submitButtonDisabled)
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {uploading ? ' Uploading...' : ' Save Documents'}
        </button>
      </form>

      {/* Document Status Card */}
      {studentData?.graduationInfo?.graduated && (
        <div style={styles.statusCard}>
          <h3 style={styles.statusTitle}> Your Profile Status</h3>
          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.graduationInfo.transcript ? '✅' : '❌'}
              </span>
              <span>Transcript Uploaded</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.skills?.length > 0 ? '✅' : '❌'}
              </span>
              <span>Skills Added</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.workExperience?.length > 0 ? '✅' : '❌'}
              </span>
              <span>Work Experience</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusIcon}>
                {studentData.graduationInfo.cgpa >= 3.0 ? '✅' : '⚠️'}
              </span>
              <span>CGPA: {studentData.graduationInfo.cgpa}</span>
            </div>
          </div>
          <p style={styles.statusNote}>
            {studentData.graduationInfo.transcript && studentData.skills?.length > 0
              ? 'Your profile is complete! You can now apply for jobs.'
              : 'Complete all sections to maximize your job opportunities.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Browse Jobs Component
const BrowseJobs = ({ studentData }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [detailedJobs, setDetailedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all');

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
          companyName: companyResult.success ? companyResult.data.name : 'Unknown Company',
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
        coverLetter: ''
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
      color: '#2c3e50',
      background: 'linear-gradient(135deg, #dc2626, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold'
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
      backgroundColor: '#fed7aaff',
      color: 'white',
      borderColor: '#f6bf7fff'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #fed7aa'
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
      border: '1px solid #fed7aa',
      transition: 'transform 0.3s'
    },
    jobCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
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
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    applyButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    },
    applyButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    jobCards: {},
    applyButtons: {},
    filterTabs: {}
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
            ...(filter === 'all' ? styles.activeFilterTab : {}),
            ...(hoverStates.filterTabs['all'] && filter !== 'all' && { backgroundColor: '#f8f9fa' })
          }}
          onMouseEnter={() => handleMouseEnter('all', 'filterTabs')}
          onMouseLeave={() => handleMouseLeave('all', 'filterTabs')}
        >
          All Jobs ({detailedJobs.length})
        </button>
        <button 
          onClick={() => setFilter('matched')}
          style={{
            ...styles.filterTab,
            ...(filter === 'matched' ? styles.activeFilterTab : {}),
            ...(hoverStates.filterTabs['matched'] && filter !== 'matched' && { backgroundColor: '#f8f9fa' })
          }}
          onMouseEnter={() => handleMouseEnter('matched', 'filterTabs')}
          onMouseLeave={() => handleMouseLeave('matched', 'filterTabs')}
        >
          Matched (50%+) ({detailedJobs.filter(j => j.matchScore >= 50).length})
        </button>
        <button 
          onClick={() => setFilter('high-match')}
          style={{
            ...styles.filterTab,
            ...(filter === 'high-match' ? styles.activeFilterTab : {}),
            ...(hoverStates.filterTabs['high-match'] && filter !== 'high-match' && { backgroundColor: '#f8f9fa' })
          }}
          onMouseEnter={() => handleMouseEnter('high-match', 'filterTabs')}
          onMouseLeave={() => handleMouseLeave('high-match', 'filterTabs')}
        >
          High Match (70%+) ({detailedJobs.filter(j => j.matchScore >= 70).length})
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div style={styles.emptyState}>
          
          <h2>No Jobs Found</h2>
          <p>No job opportunities match your current filter.</p>
        </div>
      ) : (
        <div style={styles.jobsGrid}>
          {filteredJobs.map(job => (
            <div key={job.id} style={{
              ...styles.jobCard,
              ...(hoverStates.jobCards[job.id] && styles.jobCardHover)
            }}
            onMouseEnter={() => handleMouseEnter(job.id, 'jobCards')}
            onMouseLeave={() => handleMouseLeave(job.id, 'jobCards')}>
              <div style={styles.jobHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.companyName}>{job.companyName}</p>
                  <p style={styles.location}>📍 {job.location}</p>
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
                  <span style={styles.detailIcon}>💼</span>
                  <span>{job.employmentType}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>💰</span>
                  <span>LSL {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailIcon}>📅</span>
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
                  ...(hoverStates.applyButtons[job.id] && styles.applyButtonHover),
                  ...(!studentData?.graduationInfo?.graduated && styles.applyButtonDisabled)
                }}
                onMouseEnter={() => handleMouseEnter(job.id, 'applyButtons')}
                onMouseLeave={() => handleMouseLeave(job.id, 'applyButtons')}
              >
                {applying ? ' Applying...' : ' Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}
           {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #fed7aa',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '3rem 1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <img src={logo} alt="logo" width="40" height="60" />
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #dc2626, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ThutoPele
                </span>
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                Mokorotlo oa thuto le mesebetsi
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>About Us</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Careers</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Resources</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Blog</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Help Center</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Contact Us</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none' }}>Terms of Service</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>Location</h4>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem', color: '#f97316' }} />
                Maseru, Lesotho
              </p>
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                Serving all 10 districts of Lesotho
              </p>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #fed7aa',
            paddingTop: '2rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            © 2025 ThutoPele. Empowering careers across Lesotho, one step at a time.
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
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
      <Footer/>
    </div>
  );
};

export default StudentDashboard;