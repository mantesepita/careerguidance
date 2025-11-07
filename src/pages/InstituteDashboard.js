import React, { useState, useEffect } from 'react';
import { Home, Building, Users, BookOpen, FileCheck, Calendar, LogOut, Menu, X, Bell, TrendingUp, AlertCircle,MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  createDocument, 
  queryDocuments, 
  updateDocument, 
  deleteDocument,
  getDocument,
  createDocumentWithId
} from '../firebase/helpers';
import logo from './logo.png';

const InstituteDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [dashboardData, setDashboardData] = useState({
    name: '',
    status: 'pending',
    stats: {
      totalFaculties: 0,
      totalCourses: 0,
      totalApplications: 0,
      pendingApplications: 0
    }
  });

  const refreshDashboardData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Institution Profile', icon: Building },
    { id: 'faculties', label: 'Manage Faculties', icon: Users },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'applications', label: 'Student Applications', icon: FileCheck },
    { id: 'admissions', label: 'Publish Admissions', icon: Calendar }
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'home':
        return <HomePage dashboardData={dashboardData} setActivePage={setActivePage} refreshTrigger={refreshTrigger} />;
      case 'profile':
        return <InstituteProfile refreshData={refreshDashboardData} />;
      case 'faculties':
        return <ManageFaculties />;
      case 'courses':
        return <ManageCourses />;
      case 'applications':
        return <ViewApplications />;
      case 'admissions':
        return <PublishAdmissions />;
      default:
        return <HomePage dashboardData={dashboardData} setActivePage={setActivePage} refreshTrigger={refreshTrigger} />;
    }
  };

  // Inline styles
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
    bellButton: {
      position: 'relative',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.3s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    badge: {
      position: 'absolute',
      top: '0.25rem',
      right: '0.25rem',
      width: '1.25rem',
      height: '1.25rem',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      color: 'white',
      fontSize: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
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
    mobileMenuButton: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.3s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
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
    
  };

  const [hoverStates, setHoverStates] = useState({
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
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
                <h1 style={styles.logoText}>Institution Portal</h1>
                <p style={styles.logoSubtext}>Management Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div style={styles.desktopNav}>
              <button 
                style={{
                  ...styles.bellButton,
                  ...(hoverStates.bellButton && { backgroundColor: '#fed7aa' })
                }}
                onMouseEnter={() => handleMouseEnter('bellButton', 'bellButton')}
                onMouseLeave={() => handleMouseLeave('bellButton', 'bellButton')}
              >
                <Bell size={20} color="#4b5563" />
                {dashboardData.stats.pendingApplications > 0 && (
                  <span style={styles.badge}>{dashboardData.stats.pendingApplications}</span>
                )}
              </button>
              <div style={styles.userSection}>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.userName}>{dashboardData.name || currentUser?.email}</p>
                  <p style={styles.userRole}>Institution</p>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    ...styles.logoutButton,
                    ...(hoverStates.logoutButton && { backgroundColor: '#fee2e2' })
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
                ...(hoverStates.mobileMenuButton && { backgroundColor: '#fed7aa' })
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
                    ...(hoverStates.navButtons[item.id] && (activePage === item.id ? { transform: 'scale(1.05)' } : { backgroundColor: '#fed7aa' }))
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon size={20} />
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                  {item.id === 'applications' && dashboardData.stats.pendingApplications > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      fontWeight: 'bold'
                    }}>
                      {dashboardData.stats.pendingApplications}
                    </span>
                  )}
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
                    ...(hoverStates.navButtons[item.id] && (activePage === item.id ? { transform: 'scale(1.05)' } : { backgroundColor: '#fed7aa' }))
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon size={20} />
                  <span style={{ fontWeight: 500, flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.id === 'applications' && dashboardData.stats.pendingApplications > 0 && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      fontWeight: 'bold'
                    }}>
                      {dashboardData.stats.pendingApplications}
                    </span>
                  )}
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
    </div>
  );
};

// Embedded InstituteProfile Component
const InstituteProfile = ({ refreshData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    loadInstitutionProfile();
  }, [currentUser]);

  const loadInstitutionProfile = async () => {
    if (currentUser) {
      const result = await getDocument('institutions', currentUser.uid);
      if (result.success) {
        setFormData(result.data);
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileData = {
        ...formData,
        userId: currentUser.uid
      };

      const existingProfile = await getDocument('institutions', currentUser.uid);
      
      let result;
      if (existingProfile.success) {
        result = await updateDocument('institutions', currentUser.uid, profileData);
      } else {
        result = await createDocumentWithId('institutions', currentUser.uid, profileData);
      }

      if (result.success) {
        setSuccess('✅ Institution profile saved successfully!');
        refreshData();
        window.scrollTo(0, 0);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to save profile: ' + err.message);
    }

    setLoading(false);
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
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
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px'
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
      fontWeight: '600'
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
    submitButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#d1a559ff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Institution Profile</h1>
      <p style={styles.subtitle}>Complete your institution information</p>

      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {formData.status === 'pending' && (
        <div style={styles.warningAlert}>
          <strong>Pending Approval</strong>
          <p>Your institution is pending admin approval. You can still complete your profile.</p>
        </div>
      )}

      {formData.status === 'active' && (
        <div style={styles.successAlert}>
          <strong> Active</strong>
          <p>Your institution is approved and active.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Institution Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., National University of Lesotho"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Acronym *</label>
              <input
                type="text"
                name="acronym"
                value={formData.acronym}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., NUL"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Brief description of your institution"
              rows="4"
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="info@institution.ls"
              />
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
                placeholder="+266-XXXX-XXXX"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Physical Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Full physical address"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://www.institution.ls"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.submitButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

// Embedded ManageFaculties Component
const ManageFaculties = () => {
  const { currentUser } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dean: '',
    email: ''
  });

  useEffect(() => {
    loadFaculties();
  }, [currentUser]);

  const loadFaculties = async () => {
    setLoading(true);
    const result = await queryDocuments('faculties', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);

    if (result.success) {
      setFaculties(result.data);
    }
    setLoading(false);
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
    setMessage({ type: '', text: '' });

    try {
      const facultyData = {
        ...formData,
        institutionId: currentUser.uid
      };

      let result;
      if (editingFaculty) {
        result = await updateDocument('faculties', editingFaculty.id, facultyData);
        if (result.success) {
          setMessage({ type: 'success', text: '✅ Faculty updated successfully!' });
        }
      } else {
        result = await createDocument('faculties', facultyData);
        if (result.success) {
          setMessage({ type: 'success', text: '✅ Faculty created successfully!' });
        }
      }

      if (result.success) {
        setFormData({ name: '', description: '', dean: '', email: '' });
        setShowForm(false);
        setEditingFaculty(null);
        loadFaculties();
      } else {
        setMessage({ type: 'error', text: `❌ ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to save faculty' });
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      description: faculty.description,
      dean: faculty.dean,
      email: faculty.email
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')) {
      return;
    }

    const result = await deleteDocument('faculties', facultyId);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Faculty deleted successfully!' });
      loadFaculties();
    } else {
      setMessage({ type: 'error', text: '❌ Failed to delete faculty' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFaculty(null);
    setFormData({ name: '', description: '', dean: '', email: '' });
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      fontSize: '32px',
      margin: '0 0 10px 0',
      color: '#2c3e50'
    },
    subtitle: {
      fontSize: '16px',
      color: '#7f8c8d',
      margin: 0
    },
    addButton: {
      padding: '12px 24px',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer'
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
    formCard: {
      backgroundColor: '#f8f9fa',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '30px'
    },
    formTitle: {
      fontSize: '24px',
      marginBottom: '25px',
      color: '#2c3e50'
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
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    formActions: {
      display: 'flex',
      gap: '15px',
      marginTop: '25px'
    },
    submitButton: {
      flex: 1,
      padding: '12px',
      backgroundColor: '#d1a559ff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px'
    },
    emptyIcon: {
      fontSize: '80px',
      marginBottom: '20px'
    },
    facultiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px'
    },
    facultyCard: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    facultyHeader: {
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '2px solid #e9ecef'
    },
    facultyName: {
      margin: 0,
      fontSize: '20px',
      color: '#2c3e50'
    },
    facultyDescription: {
      color: '#555',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    facultyDetails: {
      marginBottom: '20px'
    },
    detailRow: {
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
    cardActions: {
      display: 'flex',
      gap: '10px'
    },
    editButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: 'coral',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    deleteButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading faculties...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Faculties</h1>
          <p style={styles.subtitle}>Create and manage your institution's faculties</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? 'Cancel' : 'Add Faculty'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Faculty Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., Faculty of Information & Communication Technology"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Brief description of the faculty"
                rows="3"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dean/Head of Faculty </label>
                <input
                  type="text"
                  name="dean"
                  value={formData.dean}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Dr. Moeketse"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Faculty Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="faculty@institution.ls"
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                {editingFaculty ? 'Update Faculty' : 'Create Faculty'}
              </button>
              <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {faculties.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📚</div>
          <h2>No Faculties Yet</h2>
          <p>Create your first faculty to start organizing your courses.</p>
        </div>
      ) : (
        <div style={styles.facultiesGrid}>
          {faculties.map(faculty => (
            <div key={faculty.id} style={styles.facultyCard}>
              <div style={styles.facultyHeader}>
                <h3 style={styles.facultyName}>{faculty.name}</h3>
              </div>

              <p style={styles.facultyDescription}>{faculty.description}</p>

              <div style={styles.facultyDetails}>
                <div style={styles.detailRow}>
                  
                  <span><strong>Dean:</strong> {faculty.dean}</span>
                </div>
                <div style={styles.detailRow}>
                  
                  <span><strong>Email:</strong>{faculty.email}</span>
                </div>
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(faculty)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faculty.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Embedded ManageCourses Component
const ManageCourses = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    facultyId: '',
    courseName: '',
    courseCode: '',
    duration: '',
    level: 'undergraduate',
    requirements: {
      minimumPoints: '',
      requiredSubjects: '',
      minimumGrade: 'C'
    },
    description: '',
    fees: '',
    intake: '',
    availableSlots: '',
    admissionStatus: 'open'
  });

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);

    const facultiesResult = await queryDocuments('faculties', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (facultiesResult.success) setFaculties(facultiesResult.data);

    const coursesResult = await queryDocuments('courses', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (coursesResult.success) setCourses(coursesResult.data);

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const requiredSubjectsArray = formData.requirements.requiredSubjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const courseData = {
        institutionId: currentUser.uid,
        facultyId: formData.facultyId,
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        duration: formData.duration,
        level: formData.level,
        requirements: {
          minimumPoints: parseInt(formData.requirements.minimumPoints),
          requiredSubjects: requiredSubjectsArray,
          minimumGrade: formData.requirements.minimumGrade
        },
        description: formData.description,
        fees: parseFloat(formData.fees),
        intake: formData.intake,
        availableSlots: parseInt(formData.availableSlots),
        admissionStatus: formData.admissionStatus
      };

      let result;
      if (editingCourse) {
        result = await updateDocument('courses', editingCourse.id, courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? '✅ Course updated successfully!'
            : `❌ ${result.error}`
        });
      } else {
        result = await createDocument('courses', courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? '✅ Course created successfully!'
            : `❌ ${result.error}`
        });
      }

      if (result.success) {
        resetForm();
        loadData();
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to save course' });
    }
  };

  const resetForm = () => {
    setFormData({
      facultyId: '',
      courseName: '',
      courseCode: '',
      duration: '',
      level: 'undergraduate',
      requirements: {
        minimumPoints: '',
        requiredSubjects: '',
        minimumGrade: 'C'
      },
      description: '',
      fees: '',
      intake: '',
      availableSlots: '',
      admissionStatus: 'open'
    });
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      facultyId: course.facultyId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      duration: course.duration,
      level: course.level,
      requirements: {
        minimumPoints: course.requirements.minimumPoints.toString(),
        requiredSubjects: course.requirements.requiredSubjects.join(', '),
        minimumGrade: course.requirements.minimumGrade
      },
      description: course.description,
      fees: course.fees.toString(),
      intake: course.intake,
      availableSlots: course.availableSlots.toString(),
      admissionStatus: course.admissionStatus
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const result = await deleteDocument('courses', courseId);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.success
        ? '✅ Course deleted successfully!'
        : '❌ Failed to delete course'
    });
    if (result.success) loadData();
  };

  const toggleAdmissionStatus = async (course) => {
    const newStatus = course.admissionStatus === 'open' ? 'closed' : 'open';
    const result = await updateDocument('courses', course.id, {
      admissionStatus: newStatus
    });
    if (result.success) {
      setMessage({
        type: 'success',
        text: `✅ Admission ${newStatus === 'open' ? 'opened' : 'closed'} for ${course.courseName}`
      });
      loadData();
    }
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      color: '#2c3e50',
      fontSize: '32px',
      margin: '0'
    },
    addButton: {
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    input: {
      display: 'block',
      width: '100%',
      marginBottom: '15px',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px'
    },
    textarea: {
      display: 'block',
      width: '100%',
      marginBottom: '15px',
      padding: '12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px'
    },
    submitButton: {
      background: '#d1a559ff',
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    successAlert: {
      background: '#d4edda',
      color: '#155724',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #c3e6cb'
    },
    errorAlert: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #f5c6cb'
    },
    coursesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    courseCard: {
      border: '1px solid #e9ecef',
      padding: '20px',
      borderRadius: '12px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    smallButton: {
      marginRight: '10px',
      background: '#f1db59ff',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    warningCard: {
      padding: '40px',
      textAlign: 'center',
      background: '#fff3cd',
      borderRadius: '8px',
      border: '1px solid #ffc107'
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center' }}>Loading courses...</h2>
    </div>
  );

  if (faculties.length === 0)
    return (
      <div style={styles.container}>
        <div style={styles.warningCard}>
          <h2>No Faculties Found</h2>
          <p>Create a faculty first under "Manage Faculties" before adding courses.</p>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Courses</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? ' Cancel' : ' Add Course'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Faculty</option>
            {faculties.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <input
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="Course Name"
            required
            style={styles.input}
          />

          <input
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            required
            style={styles.input}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course Description"
            required
            style={styles.textarea}
          />

          <button type="submit" style={styles.submitButton}>
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>
        </form>
      )}

      <div style={styles.coursesGrid}>
        {courses.length === 0 ? (
          <p>No courses available. Create one above.</p>
        ) : (
          courses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{course.courseName}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d' }}><strong>Code:</strong> {course.courseCode}</p>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>{course.description}</p>
              <p style={{ margin: '0 0 15px 0' }}>
                <strong>Status:</strong> 
                <span style={{ 
                  color: course.admissionStatus === 'open' ? '#27ae60' : '#e74c3c',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {course.admissionStatus.toUpperCase()}
                </span>
              </p>
              <div>
                <button onClick={() => toggleAdmissionStatus(course)} style={{...styles.smallButton, 
                  background: course.admissionStatus === 'open' ? 'coral' : '#27ae60'
                }}>
                  {course.admissionStatus === 'open' ? 'Close' : 'Open'}
                </button>
                <button onClick={() => handleEdit(course)} style={styles.smallButton}>Edit</button>
                <button onClick={() => handleDelete(course.id)} style={{...styles.smallButton, background: '#e74c3c'}}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Embedded ViewApplications Component
const ViewApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) loadApplications();
  }, [currentUser]);

  const loadApplications = async () => {
    setLoading(true);
    const result = await queryDocuments('applications', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (result.success) {
      setApplications(result.data);
    } else {
      setMessage('❌ Failed to load applications');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateDocument('applications', id, { status: newStatus });
    if (result.success) {
      setMessage(`✅ Application ${newStatus} successfully`);
      loadApplications();
    } else {
      setMessage('❌ Failed to update status');
    }
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      color: '#2c3e50',
      marginBottom: '20px',
      fontSize: '32px'
    },
    alert: {
      padding: '15px',
      backgroundColor: '#d4edda',
      color: '#155724',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #c3e6cb'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #e9ecef'
    },
    tableCell: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #e9ecef'
    },
    button: {
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      marginRight: '5px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px'
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Loading applications...</h3>
    </div>
  );

  if (applications.length === 0)
    return (
      <div style={styles.container}>
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#7f8c8d' }}>No student applications found.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Student Applications</h1>
      {message && <div style={styles.alert}>{message}</div>}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Student Name</th>
            <th style={styles.tableCell}>Course</th>
            <th style={styles.tableCell}>Status</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td style={styles.tableCell}>{app.studentName}</td>
              <td style={styles.tableCell}>{app.courseName}</td>
              <td style={styles.tableCell}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: 
                    app.status === 'admitted' ? '#d4edda' :
                    app.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                  color:
                    app.status === 'admitted' ? '#155724' :
                    app.status === 'rejected' ? '#721c24' : '#856404'
                }}>
                  {app.status.toUpperCase()}
                </span>
              </td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleStatusChange(app.id, 'admitted')}
                  style={{ ...styles.button, backgroundColor: '#27ae60' }}
                >
                  ✅ Admit
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  style={{ ...styles.button, backgroundColor: '#e74c3c' }}
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'pending')}
                  style={{ ...styles.button, backgroundColor: '#f1c40f' }}
                >
                  ⏳ Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Embedded PublishAdmissions Component
const PublishAdmissions = () => {
  const { currentUser } = useAuth();
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) fetchAdmittedStudents();
  }, [currentUser]);

  const fetchAdmittedStudents = async () => {
    const result = await queryDocuments('applications', [
      { field: 'institutionId', operator: '==', value: currentUser.uid },
      { field: 'status', operator: '==', value: 'admitted' }
    ]);
    if (result.success) {
      setAdmittedStudents(result.data);
      // Check if any admissions are already published
      const anyPublished = result.data.some(student => student.published);
      setPublished(anyPublished);
    } else {
      setMessage('❌ Failed to fetch admitted students');
    }
  };

  const handlePublish = async () => {
    for (let student of admittedStudents) {
      await updateDocument('applications', student.id, { published: true });
    }
    setPublished(true);
    setMessage('✅ Admissions published successfully!');
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      color: '#2c3e50',
      marginBottom: '20px',
      fontSize: '32px'
    },
    alert: {
      padding: '15px',
      backgroundColor: '#d4edda',
      color: '#155724',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #c3e6cb'
    },
    publishButton: {
      backgroundColor: '#27ae60',
      color: '#fff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      marginBottom: '20px'
    },
    publishedText: {
      color: '#27ae60',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '20px'
    },
    studentList: {
      listStyle: 'none',
      padding: 0
    },
    studentItem: {
      padding: '12px',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Publish Admissions</h1>
      {message && <div style={styles.alert}>{message}</div>}

      {admittedStudents.length === 0 ? (
        <p>No admitted students yet.</p>
      ) : (
        <>
          <p>Ready to publish admissions for {admittedStudents.length} students.</p>
          {!published ? (
            <button onClick={handlePublish} style={styles.publishButton}>
              📢 Publish Admissions
            </button>
          ) : (
            <p style={styles.publishedText}>✅ Admissions already published</p>
          )}
          <ul style={styles.studentList}>
            {admittedStudents.map((s) => (
              <li key={s.id} style={styles.studentItem}>
                <span><strong>{s.studentName}</strong> — {s.courseName}</span>
                {s.published && <span style={{ color: '#27ae60' }}>✅ Published</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// HomePage Component (already embedded)
const HomePage = ({ dashboardData, setActivePage, refreshTrigger }) => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalFaculties: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  const [instituteData, setInstituteData] = useState({
    name: '',
    status: 'pending'
  });

  React.useEffect(() => {
    loadDashboardData();
  }, [currentUser, refreshTrigger]);

  const loadDashboardData = async () => {
    // Mock data - in real implementation, this would fetch from Firebase
    const mockData = {
      name: 'University of Excellence',
      status: 'active',
      stats: {
        totalFaculties: 8,
        totalCourses: 45,
        totalApplications: 324,
        pendingApplications: 28
      }
    };
    
    setInstituteData({
      name: mockData.name,
      status: mockData.status
    });
    setStats(mockData.stats);
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
    alertCard: {
      background: 'linear-gradient(to right, #fffbeb, #fed7aa)',
      border: '2px solid #fdba74',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    alertContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    },
    alertIcon: {
      width: '3rem',
      height: '3rem',
      backgroundColor: '#f97316',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    alertTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#7c2d12',
      marginBottom: '0.5rem'
    },
    alertText: {
      color: '#92400e',
      marginBottom: '1rem'
    },
    alertButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      fontWeight: 600,
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    quickActions: {
      marginTop: '2rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
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
    alertButton: false,
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
      key: 'faculties', 
      number: stats.totalFaculties, 
      label: 'Faculties', 
      icon: Users, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#16a34a', text: 'Active' }
    },
    { 
      key: 'courses', 
      number: stats.totalCourses, 
      label: 'Courses', 
      icon: BookOpen, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#16a34a', text: 'Published' }
    },
    { 
      key: 'applications', 
      number: stats.totalApplications, 
      label: 'Total Applications', 
      icon: FileCheck, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#2563eb', text: 'All time' }
    },
    { 
      key: 'pending', 
      number: stats.pendingApplications, 
      label: 'Pending Review', 
      icon: AlertCircle, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#ea580c', text: 'Action needed' }
    }
  ];

  const quickActions = [
    {
      key: 'courses',
      title: 'Add New Course',
      text: 'Create a new course offering for students',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('courses')
    },
    {
      key: 'applications',
      title: 'Review Applications',
      text: 'Process and review student applications',
      icon: FileCheck,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('applications')
    },
    {
      key: 'admissions',
      title: 'Publish Admissions',
      text: 'Announce admission results to students',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      onClick: () => setActivePage('admissions')
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
          <p style={styles.welcomeSubtitle}>{instituteData.name || 'Institution Portal'}</p>
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
                ...(hoverStates.statCards[stat.key] && { 
                  transform: 'translateY(-0.25rem)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                })
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

      {/* Alert Cards */}
      {!instituteData.name && (
        <div style={styles.alertCard}>
          <div style={styles.alertContent}>
            <div style={styles.alertIcon}>
              <Bell size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={styles.alertTitle}>Complete Your Profile</h3>
              <p style={styles.alertText}>
                Please complete your institution profile to start managing courses and applications.
              </p>
              <button
                onClick={() => setActivePage('profile')}
                style={{
                  ...styles.alertButton,
                  ...(hoverStates.alertButton && {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
                  })
                }}
                onMouseEnter={() => handleMouseEnter('alertButton', 'alertButton')}
                onMouseLeave={() => handleMouseLeave('alertButton', 'alertButton')}
              >
                Complete Profile Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {instituteData.status === 'pending' && (
        <div style={{ ...styles.alertCard, background: 'linear-gradient(to right, #fff3cd, #ffeaa7)', borderColor: '#ffd43b' }}>
          <div style={styles.alertContent}>
            <div style={{ ...styles.alertIcon, backgroundColor: '#ffc107' }}>
              <AlertCircle size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ ...styles.alertTitle, color: '#856404' }}>Pending Approval</h3>
              <p style={{ ...styles.alertText, color: '#856404' }}>
                Your institution is pending admin approval. You can still complete your profile and set up courses.
              </p>
            </div>
          </div>
        </div>
      )}

      {stats.pendingApplications > 0 && (
        <div style={{ ...styles.alertCard, background: 'linear-gradient(to right, #fef2f2, #fecaca)', borderColor: '#fca5a5' }}>
          <div style={styles.alertContent}>
            <div style={{ ...styles.alertIcon, backgroundColor: '#ef4444' }}>
              <AlertCircle size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ ...styles.alertTitle, color: '#7f1d1d' }}>Pending Applications</h3>
              <p style={{ ...styles.alertText, color: '#991b1b' }}>
                You have {stats.pendingApplications} student applications waiting for your review.
              </p>
              <button
                onClick={() => setActivePage('applications')}
                style={{
                  ...styles.alertButton,
                  background: 'linear-gradient(to right, #ef4444, #ec4899)',
                  ...(hoverStates.alertButton && {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
                  })
                }}
                onMouseEnter={() => handleMouseEnter('alertButton', 'alertButton')}
                onMouseLeave={() => handleMouseLeave('alertButton', 'alertButton')}
              >
                Review Applications →
              </button>
            </div>
          </div>
        </div>
      )}

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
                  ...(hoverStates.quickActionCards[action.key] && {
                    transform: 'translateY(-0.5rem)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  })
                }}
                onMouseEnter={() => handleMouseEnter(action.key, 'quickActionCards')}
                onMouseLeave={() => handleMouseLeave(action.key, 'quickActionCards')}
              >
                <div
                  style={{
                    ...styles.quickActionIcon,
                    background: action.gradient,
                    ...(hoverStates.quickActionIcons[action.key] && { transform: 'scale(1.1)' })
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

export default InstituteDashboard;