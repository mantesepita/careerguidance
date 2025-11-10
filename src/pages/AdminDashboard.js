import React, { useState, useEffect } from 'react';
import { 
  Home, Shield, Building, Building2, BarChart3, Settings, LogOut, Menu, X, Bell, 
  Users, BookOpen, FileText, AlertTriangle, TrendingUp, CheckCircle, Plus, 
  Edit, Trash2, Eye, Search, Filter, Download, Upload, Calendar, Mail, Phone,
  MapPin, Globe, User, GraduationCap, Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllDocuments, createDocument, updateDocument, deleteDocument, queryDocuments } from '../firebase/helpers';
import Footer from './Footer';
import logo from './logo.png';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutions: 0,
    totalCompanies: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalApplications: 0,
    pendingInstitutions: 0,
    pendingCompanies: 0,
    admittedStudents: 0,
    activeJobs: 0
  });

  const adminData = {
    email: 'admin@system.com',
    role: 'Administrator'
  };

  const navigation = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'institutions', label: 'Manage Institutions', icon: Building, badge: stats.pendingInstitutions },
    { id: 'companies', label: 'Manage Companies', icon: Building2, badge: stats.pendingCompanies },
    { id: 'faculties', label: 'Manage Faculties', icon: Users },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'admissions', label: 'Publish Admissions', icon: FileText },
    { id: 'reports', label: 'System Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load institutions
      const institutionsResult = await getAllDocuments('institutions');
      const institutions = institutionsResult.success ? institutionsResult.data : [];
      
      // Load companies
      const companiesResult = await getAllDocuments('companies');
      const companies = companiesResult.success ? companiesResult.data : [];
      
      // Load students
      const studentsResult = await queryDocuments('users', [{ field: 'role', operator: '==', value: 'student' }]);
      const students = studentsResult.success ? studentsResult.data : [];
      
      // Load courses
      const coursesResult = await getAllDocuments('courses');
      const courses = coursesResult.success ? coursesResult.data : [];
      
      // Load applications
      const applicationsResult = await getAllDocuments('applications');
      const applications = applicationsResult.success ? applicationsResult.data : [];

      // Load jobs
      const jobsResult = await getAllDocuments('jobs');
      const jobs = jobsResult.success ? jobsResult.data : [];

      setStats({
        totalUsers: students.length + institutions.length + companies.length,
        totalInstitutions: institutions.length,
        totalCompanies: companies.length,
        totalStudents: students.length,
        totalCourses: courses.length,
        totalApplications: applications.length,
        pendingInstitutions: institutions.filter(inst => inst.status === 'pending').length,
        pendingCompanies: companies.filter(comp => comp.status === 'pending').length,
        admittedStudents: applications.filter(app => app.status === 'admitted').length,
        activeJobs: jobs.filter(job => job.status === 'active').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const renderContent = () => {
    switch(activePage) {
      case 'home':
        return <HomePage stats={stats} setActivePage={setActivePage} />;
      case 'institutions':
        return <InstitutionsPage stats={stats} refreshStats={loadStats} />;
      case 'companies':
        return <CompaniesPage stats={stats} refreshStats={loadStats} />;
      case 'faculties':
        return <FacultiesPage />;
      case 'courses':
        return <CoursesPage />;
      case 'admissions':
        return <AdmissionsPage refreshStats={loadStats} />;
      case 'reports':
        return <ReportsPage stats={stats} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage stats={stats} setActivePage={setActivePage} />;
    }
  };

  // Inline styles for the main dashboard layout
  const dashboardStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fff1f2 50%, #fffbeb 100%)',
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
      background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #dc2626, #db2777)',
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
      transition: 'background-color 0.2s',
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
      fontWeight: 600,
      color: '#1f2937'
    },
    userRole: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    logoutButton: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    },
    mobileMenuButton: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
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
      backdropFilter: 'blur(10px)'
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
      transition: 'all 0.2s',
      position: 'relative',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px'
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
    }
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

  return (
    <div style={dashboardStyles.container}>
      {/* Top Navigation Bar */}
      <nav style={dashboardStyles.nav}>
        <div style={dashboardStyles.navContainer}>
          <div style={dashboardStyles.navContent}>
            {/* Logo */}
            <div style={dashboardStyles.logo}>
              <div >
                <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
              </div>
              <div>
                <h1 style={dashboardStyles.logoText}>Admin Portal</h1>
                <p style={dashboardStyles.logoSubtext}>System Administration</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div style={{ 
              ...dashboardStyles.desktopNav,
              '@media (min-width: 768px)': { display: 'flex' }
            }}>
              <button style={{
                ...dashboardStyles.bellButton,
                backgroundColor: hoverStates.bellButton ? '#ffedd5' : 'transparent'
              }} onMouseEnter={() => handleMouseEnter('bellButton', 'bellButton')} 
                  onMouseLeave={() => handleMouseLeave('bellButton', 'bellButton')}>
                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#4b5563' }} />
                {(stats.pendingInstitutions + stats.pendingCompanies) > 0 && (
                  <span style={dashboardStyles.badge}>
                    {stats.pendingInstitutions + stats.pendingCompanies}
                  </span>
                )}
              </button>
              <div style={dashboardStyles.userSection}>
                <div style={{ textAlign: 'right' }}>
                  <p style={dashboardStyles.userName}>{adminData.email}</p>
                  <p style={dashboardStyles.userRole}>{adminData.role}</p>
                </div>
                <button style={{
                  ...dashboardStyles.logoutButton,
                  backgroundColor: hoverStates.logoutButton ? '#fee2e2' : 'transparent'
                }} onMouseEnter={() => handleMouseEnter('logoutButton', 'logoutButton')} 
                    onMouseLeave={() => handleMouseLeave('logoutButton', 'logoutButton')}>
                  <LogOut style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    color: '#4b5563'
                  }} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                ...dashboardStyles.mobileMenuButton,
                backgroundColor: hoverStates.mobileMenuButton ? '#ffedd5' : 'transparent'
              }} onMouseEnter={() => handleMouseEnter('mobileMenuButton', 'mobileMenuButton')} 
                  onMouseLeave={() => handleMouseLeave('mobileMenuButton', 'mobileMenuButton')}>
              {isMobileMenuOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          ...dashboardStyles.mobileMenu
        }}>
          <div style={dashboardStyles.mobileMenuContent}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    ...dashboardStyles.navButton,
                    background: isActive 
                      ? 'linear-gradient(to right, #f97316, #ec4899)'
                      : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    backgroundColor: hoverStates.navButtons[item.id] && !isActive ? '#ffedd5' : undefined
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      fontWeight: 'bold'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        maxWidth: '80rem', 
        margin: '0 auto' 
      }}>
        {/* Sidebar - Desktop */}
        <aside style={{
          ...dashboardStyles.sidebar,
          '@media (min-width: 768px)': { display: 'block' }
        }}>
          <nav style={dashboardStyles.sidebarNav}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    ...dashboardStyles.navButton,
                    background: isActive 
                      ? 'linear-gradient(to right, #f97316, #ec4899)'
                      : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: hoverStates.navButtons[item.id] && !isActive ? 'white' : undefined,
                    boxShadow: hoverStates.navButtons[item.id] && !isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : undefined
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id, 'navButtons')}
                  onMouseLeave={() => handleMouseLeave(item.id, 'navButtons')}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span style={{ fontWeight: 500, flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      fontWeight: 'bold'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={dashboardStyles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Styles for all the page components
const pageStyles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #f97316, #ec4899)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
  },
  addButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#dc2626',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #fed7aa'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    color: '#6b7280',
    transition: 'background-color 0.2s'
  },
  closeButtonHover: {
    backgroundColor: '#ffedd5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
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
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.3s',
    outline: 'none'
  },
  inputFocus: {
    borderColor: '#f97316',
    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    transition: 'all 0.3s',
    outline: 'none'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
    outline: 'none',
    minHeight: '100px'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #fed7aa'
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  cancelButtonHover: {
    backgroundColor: '#f9fafb'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #f97316, #ec4899)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
  },
  submitButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #fed7aa'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    backgroundColor: '#fffbeb',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #fed7aa',
    fontSize: '0.875rem'
  },
  tr: {
    borderBottom: '1px solid #fed7aa',
    transition: 'background-color 0.2s'
  },
  trHover: {
    backgroundColor: '#fffbeb'
  },
  td: {
    padding: '1rem',
    color: '#374151',
    fontSize: '0.875rem'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    display: 'inline-block'
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  statusSuspended: {
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  editButton: {
    padding: '0.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  editButtonHover: {
    backgroundColor: '#2563eb',
    transform: 'scale(1.05)'
  },
  approveButton: {
    padding: '0.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  approveButtonHover: {
    backgroundColor: '#059669',
    transform: 'scale(1.05)'
  },
  suspendButton: {
    padding: '0.5rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  suspendButtonHover: {
    backgroundColor: '#d97706',
    transform: 'scale(1.05)'
  },
  deleteButton: {
    padding: '0.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  deleteButtonHover: {
    backgroundColor: '#dc2626',
    transform: 'scale(1.05)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    color: '#6b7280'
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '2px solid #f3f4f6',
    borderTop: '2px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  searchContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1',
    minWidth: '250px',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    transition: 'all 0.3s',
    outline: 'none'
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    minWidth: '150px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #fed7aa',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s'
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

// HomePage Component
const HomePage = ({ stats, setActivePage }) => {
  const homeStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
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
      transition: 'all 0.3s',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
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
      color: '#059669',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    alertCard: {
      background: 'linear-gradient(to right, #fef2f2, #fdf2f8)',
      border: '2px solid #fca5a5',
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
      backgroundColor: '#ef4444',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    alertTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#7f1d1d',
      marginBottom: '0.5rem'
    },
    alertText: {
      color: '#991b1b',
      marginBottom: '1rem'
    },
    alertButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      backgroundColor: 'white',
      border: '2px solid #fca5a5',
      borderRadius: '0.75rem',
      transition: 'all 0.3s',
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'pointer',
      width: '100%'
    },
    alertButtonHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    quickActionCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      transition: 'all 0.3s',
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    quickActionCardHover: {
      transform: 'translateY(-8px)',
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
      transition: 'transform 0.3s'
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
      color: '#4b5563'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    statCards: {},
    alertButtons: {},
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

  const totalPending = stats.pendingInstitutions + stats.pendingCompanies;

  const statCards = [
    { 
      key: 'users', 
      value: stats.totalUsers, 
      label: 'Total Users', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      trend: '+45 this month',
      onClick: () => setActivePage('reports')
    },
    { 
      key: 'students', 
      value: stats.totalStudents, 
      label: 'Students', 
      icon: GraduationCap, 
      color: 'from-purple-500 to-purple-600', 
      trend: '+32 this month',
      onClick: () => setActivePage('admissions')
    },
    { 
      key: 'institutions', 
      value: stats.totalInstitutions, 
      label: 'Institutions', 
      icon: Building, 
      color: 'from-green-500 to-green-600', 
      trend: `${stats.totalInstitutions - stats.pendingInstitutions} active`,
      onClick: () => setActivePage('institutions')
    },
    { 
      key: 'companies', 
      value: stats.totalCompanies, 
      label: 'Companies', 
      icon: Briefcase, 
      color: 'from-orange-500 to-orange-600', 
      trend: `${stats.totalCompanies - stats.pendingCompanies} active`,
      onClick: () => setActivePage('companies')
    },
    { 
      key: 'courses', 
      value: stats.totalCourses, 
      label: 'Total Courses', 
      icon: BookOpen, 
      color: 'from-pink-500 to-pink-600', 
      trend: '+18 this month',
      onClick: () => setActivePage('courses')
    },
    { 
      key: 'applications', 
      value: stats.totalApplications, 
      label: 'Applications', 
      icon: FileText, 
      color: 'from-indigo-500 to-indigo-600', 
      trend: '+124 this month',
      onClick: () => setActivePage('admissions')
    }
  ];

  const quickActions = [
    {
      key: 'institutions',
      label: 'Review Institutions',
      icon: Building,
      color: 'from-green-500 to-green-600',
      page: 'institutions',
      description: 'Approve or suspend institutions'
    },
    {
      key: 'companies',
      label: 'Review Companies',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      page: 'companies',
      description: 'Manage company registrations'
    },
    {
      key: 'admissions',
      label: 'Publish Admissions',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      page: 'admissions',
      description: 'Manage student admissions'
    },
    {
      key: 'reports',
      label: 'View Reports',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      page: 'reports',
      description: 'Generate system reports'
    }
  ];

  return (
    <div style={homeStyles.container}>
      {/* Welcome Section */}
      <div style={homeStyles.welcomeSection}>
        <div style={homeStyles.welcomeBlob1}></div>
        <div style={homeStyles.welcomeBlob2}></div>
        <div style={{ position: 'relative' }}>
          <h1 style={homeStyles.welcomeTitle}>System Overview</h1>
          <p style={homeStyles.welcomeSubtitle}>Monitor and manage the entire platform</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={homeStyles.statsGrid}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              style={{
                ...homeStyles.statCard,
                ...(hoverStates.statCards[stat.key] && homeStyles.statCardHover)
              }}
              onMouseEnter={() => handleMouseEnter(stat.key, 'statCards')}
              onMouseLeave={() => handleMouseLeave(stat.key, 'statCards')}
              onClick={stat.onClick}
            >
              <div style={homeStyles.statHeader}>
                <div style={{
                  ...homeStyles.statIcon,
                  background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <span style={homeStyles.statNumber}>{stat.value}</span>
              </div>
              <p style={homeStyles.statLabel}>{stat.label}</p>
              <div style={homeStyles.statTrend}>
                <TrendingUp size={16} />
                <span>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Approvals Alert */}
      {totalPending > 0 && (
        <div style={homeStyles.alertCard}>
          <div style={homeStyles.alertContent}>
            <div style={homeStyles.alertIcon}>
              <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={homeStyles.alertTitle}>Pending Approvals</h3>
              <p style={homeStyles.alertText}>
                You have {totalPending} pending approval{totalPending !== 1 ? 's' : ''} requiring your attention.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {stats.pendingInstitutions > 0 && (
                  <button 
                    onClick={() => setActivePage('institutions')}
                    style={{
                      ...homeStyles.alertButton,
                      ...(hoverStates.alertButtons.institutions && homeStyles.alertButtonHover)
                    }}
                    onMouseEnter={() => handleMouseEnter('institutions', 'alertButtons')}
                    onMouseLeave={() => handleMouseLeave('institutions', 'alertButtons')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Building style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>Institutions</span>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {stats.pendingInstitutions}
                    </span>
                  </button>
                )}
                {stats.pendingCompanies > 0 && (
                  <button 
                    onClick={() => setActivePage('companies')}
                    style={{
                      ...homeStyles.alertButton,
                      ...(hoverStates.alertButtons.companies && homeStyles.alertButtonHover)
                    }}
                    onMouseEnter={() => handleMouseEnter('companies', 'alertButtons')}
                    onMouseLeave={() => handleMouseLeave('companies', 'alertButtons')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Building2 style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>Companies</span>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '9999px',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {stats.pendingCompanies}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 style={homeStyles.sectionTitle}>Quick Actions</h2>
        <div style={homeStyles.quickActionsGrid}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button 
                key={action.key}
                onClick={() => setActivePage(action.page)}
                style={{
                  ...homeStyles.quickActionCard,
                  ...(hoverStates.quickActionCards[action.key] && homeStyles.quickActionCardHover)
                }}
                onMouseEnter={() => handleMouseEnter(action.key, 'quickActionCards')}
                onMouseLeave={() => handleMouseLeave(action.key, 'quickActionCards')}
              >
                <div
                  style={{
                    ...homeStyles.quickActionIcon,
                    background: `linear-gradient(135deg, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})`,
                    ...(hoverStates.quickActionIcons[action.key] && homeStyles.quickActionIconHover)
                  }}
                  onMouseEnter={() => handleMouseEnter(action.key, 'quickActionIcons')}
                  onMouseLeave={() => handleMouseLeave(action.key, 'quickActionIcons')}
                >
                  <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={homeStyles.quickActionTitle}>{action.label}</h3>
                <p style={homeStyles.quickActionText}>{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// InstitutionsPage Component
const InstitutionsPage = ({ stats, refreshStats }) => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    status: 'active'
  });

  const [hoverStates, setHoverStates] = useState({
    addButton: false,
    closeButton: false,
    cancelButton: false,
    submitButton: false,
    actionButtons: {}
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

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    const result = await getAllDocuments('institutions');
    if (result.success) {
      setInstitutions(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (editingInstitution) {
        result = await updateDocument('institutions', editingInstitution.id, formData);
      } else {
        result = await createDocument('institutions', {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }

      if (result.success) {
        setShowAddForm(false);
        setEditingInstitution(null);
        setFormData({ name: '', acronym: '', email: '', phone: '', address: '', website: '', description: '', status: 'active' });
        loadInstitutions();
        refreshStats();
      }
    } catch (error) {
      console.error('Error saving institution:', error);
    }
    setLoading(false);
  };

  const handleEdit = (institution) => {
    setEditingInstitution(institution);
    setFormData(institution);
    setShowAddForm(true);
  };

  const handleDelete = async (institutionId) => {
    if (window.confirm('Are you sure you want to delete this institution? This will remove all associated data.')) {
      const result = await deleteDocument('institutions', institutionId);
      if (result.success) {
        loadInstitutions();
        refreshStats();
      }
    }
  };

  const handleStatusChange = async (institutionId, status) => {
    const result = await updateDocument('institutions', institutionId, { status });
    if (result.success) {
      loadInstitutions();
      refreshStats();
    }
  };

  const filteredInstitutions = institutions.filter(institution => {
    // Safely handle potentially undefined properties
    const name = institution?.name || '';
    const acronym = institution?.acronym || '';
    const email = institution?.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || institution?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && institutions.length === 0) {
    return (
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading institutions...</p>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>Manage Institutions</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          style={{
            ...pageStyles.addButton,
            ...(hoverStates.addButton && pageStyles.addButtonHover)
          }}
          onMouseEnter={() => handleMouseEnter('addButton', 'addButton')}
          onMouseLeave={() => handleMouseLeave('addButton', 'addButton')}
        >
          <Plus size={20} />
          Add Institution
        </button>
      </div>

      {stats.pendingInstitutions > 0 && (
        <div style={pageStyles.alertBanner}>
          <AlertTriangle size={20} />
          <span>{stats.pendingInstitutions} institutions pending approval</span>
        </div>
      )}

      {/* Search and Filter */}
      <div style={pageStyles.searchContainer}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search institutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...pageStyles.searchInput, paddingLeft: '40px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={pageStyles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {showAddForm && (
        <div style={pageStyles.modalOverlay}>
          <div style={pageStyles.modalContent}>
            <div style={pageStyles.modalHeader}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>{editingInstitution ? 'Edit Institution' : 'Add New Institution'}</h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingInstitution(null); }}
                style={{
                  ...pageStyles.closeButton,
                  ...(hoverStates.closeButton && pageStyles.closeButtonHover)
                }}
                onMouseEnter={() => handleMouseEnter('closeButton', 'closeButton')}
                onMouseLeave={() => handleMouseLeave('closeButton', 'closeButton')}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={pageStyles.form}>
              <div style={pageStyles.formGrid}>
                <div style={pageStyles.formGroup}>
                  <label style={pageStyles.label}>Institution Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={pageStyles.input}
                    placeholder="University of Excellence"
                  />
                </div>
                <div style={pageStyles.formGroup}>
                  <label style={pageStyles.label}>Acronym *</label>
                  <input
                    type="text"
                    value={formData.acronym}
                    onChange={(e) => setFormData({...formData, acronym: e.target.value})}
                    required
                    style={pageStyles.input}
                    placeholder="UOE"
                  />
                </div>
                <div style={pageStyles.formGroup}>
                  <label style={pageStyles.label}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={pageStyles.input}
                    placeholder="contact@institution.edu"
                  />
                </div>
                <div style={pageStyles.formGroup}>
                  <label style={pageStyles.label}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={pageStyles.input}
                    placeholder="+266 1234 5678"
                  />
                </div>
                <div style={pageStyles.formGroup}>
                  <label style={pageStyles.label}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={pageStyles.select}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div style={pageStyles.formGroup}>
                <label style={pageStyles.label}>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={pageStyles.input}
                  placeholder="123 Main Street, Maseru"
                />
              </div>
              <div style={pageStyles.formGroup}>
                <label style={pageStyles.label}>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  style={pageStyles.input}
                  placeholder="https://www.institution.edu"
                />
              </div>
              <div style={pageStyles.formGroup}>
                <label style={pageStyles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={pageStyles.textarea}
                  rows="4"
                  placeholder="Brief description of the institution..."
                />
              </div>
              <div style={pageStyles.formActions}>
                <button 
                  type="button" 
                  onClick={() => { setShowAddForm(false); setEditingInstitution(null); }}
                  style={{
                    ...pageStyles.cancelButton,
                    ...(hoverStates.cancelButton && pageStyles.cancelButtonHover)
                  }}
                  onMouseEnter={() => handleMouseEnter('cancelButton', 'cancelButton')}
                  onMouseLeave={() => handleMouseLeave('cancelButton', 'cancelButton')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    ...pageStyles.submitButton,
                    ...(hoverStates.submitButton && pageStyles.submitButtonHover),
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={() => handleMouseEnter('submitButton', 'submitButton')}
                  onMouseLeave={() => handleMouseLeave('submitButton', 'submitButton')}
                >
                  {loading ? 'Saving...' : (editingInstitution ? 'Update Institution' : 'Create Institution')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={pageStyles.tableContainer}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Name</th>
              <th style={pageStyles.th}>Acronym</th>
              <th style={pageStyles.th}>Email</th>
              <th style={pageStyles.th}>Status</th>
              <th style={pageStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstitutions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...pageStyles.td, textAlign: 'center' }}>
                  <div style={pageStyles.emptyState}>
                    <div style={pageStyles.emptyIcon}>🏫</div>
                    <h3>No institutions found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInstitutions.map((institution) => (
                <tr 
                  key={institution.id} 
                  style={{
                    ...pageStyles.tr,
                    ...(hoverStates.actionButtons[institution.id] && pageStyles.trHover)
                  }}
                  onMouseEnter={() => handleMouseEnter(institution.id, 'actionButtons')}
                  onMouseLeave={() => handleMouseLeave(institution.id, 'actionButtons')}
                >
                  <td style={pageStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #f97316, #ec4899)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {/* FIX: Safely handle acronym */}
                        {(institution?.acronym || 'IN').substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>{institution?.name || 'Unnamed Institution'}</div>
                        {institution?.website && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            <Globe size={12} />
                            <a href={institution.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#f97316',
                      background: '#fffbeb',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {/* FIX: Safely handle acronym */}
                      {institution?.acronym || 'N/A'}
                    </span>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#6b7280" />
                      {institution?.email || 'No email'}
                    </div>
                    {institution?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        <Phone size={12} />
                        {institution.phone}
                      </div>
                    )}
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{
                      ...pageStyles.statusBadge,
                      ...(institution?.status === 'active' ? pageStyles.statusActive : 
                           institution?.status === 'pending' ? pageStyles.statusPending : pageStyles.statusSuspended)
                    }}>
                      {institution?.status || 'pending'}
                    </span>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={pageStyles.actionButtons}>
                      <button 
                        onClick={() => handleEdit(institution)} 
                        style={{
                          ...pageStyles.editButton,
                          ...(hoverStates.actionButtons[`edit-${institution.id}`] && pageStyles.editButtonHover)
                        }}
                        onMouseEnter={() => handleMouseEnter(`edit-${institution.id}`, 'actionButtons')}
                        onMouseLeave={() => handleMouseLeave(`edit-${institution.id}`, 'actionButtons')}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      {institution?.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(institution.id, 'active')}
                          style={{
                            ...pageStyles.approveButton,
                            ...(hoverStates.actionButtons[`approve-${institution.id}`] && pageStyles.approveButtonHover)
                          }}
                          onMouseEnter={() => handleMouseEnter(`approve-${institution.id}`, 'actionButtons')}
                          onMouseLeave={() => handleMouseLeave(`approve-${institution.id}`, 'actionButtons')}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {institution?.status === 'active' && (
                        <button 
                          onClick={() => handleStatusChange(institution.id, 'suspended')}
                          style={{
                            ...pageStyles.suspendButton,
                            ...(hoverStates.actionButtons[`suspend-${institution.id}`] && pageStyles.suspendButtonHover)
                          }}
                          onMouseEnter={() => handleMouseEnter(`suspend-${institution.id}`, 'actionButtons')}
                          onMouseLeave={() => handleMouseLeave(`suspend-${institution.id}`, 'actionButtons')}
                        >
                          <AlertTriangle size={14} />
                          Suspend
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(institution.id)}
                        style={{
                          ...pageStyles.deleteButton,
                          ...(hoverStates.actionButtons[`delete-${institution.id}`] && pageStyles.deleteButtonHover)
                        }}
                        onMouseEnter={() => handleMouseEnter(`delete-${institution.id}`, 'actionButtons')}
                        onMouseLeave={() => handleMouseLeave(`delete-${institution.id}`, 'actionButtons')}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CompaniesPage Component
// CompaniesPage Component
const CompaniesPage = ({ stats, refreshStats }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoverStates, setHoverStates] = useState({
    actionButtons: {}
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    const result = await getAllDocuments('companies');
    if (result.success) {
      setCompanies(result.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (companyId, status) => {
    const result = await updateDocument('companies', companyId, { status });
    if (result.success) {
      loadCompanies();
      refreshStats();
    }
  };

  // Add this delete function
  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company? This will remove all associated data including jobs and applications.')) {
      const result = await deleteDocument('companies', companyId);
      if (result.success) {
        loadCompanies();
        refreshStats();
      } else {
        alert('Error deleting company: ' + result.error);
      }
    }
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

  // Fixed filter function with null checks
  const filteredCompanies = companies.filter(company => {
    // Safely handle potentially undefined properties
    const name = company?.name || '';
    const industry = company?.industry || '';
    const email = company?.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && companies.length === 0) {
    return (
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>Manage Companies</h2>
      </div>

      {stats.pendingCompanies > 0 && (
        <div style={pageStyles.alertBanner}>
          <AlertTriangle size={20} />
          <span>{stats.pendingCompanies} companies pending approval</span>
        </div>
      )}

      {/* Search and Filter */}
      <div style={pageStyles.searchContainer}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...pageStyles.searchInput, paddingLeft: '40px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={pageStyles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div style={pageStyles.tableContainer}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Company Name</th>
              <th style={pageStyles.th}>Industry</th>
              <th style={pageStyles.th}>Contact</th>
              <th style={pageStyles.th}>Status</th>
              <th style={pageStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ ...pageStyles.td, textAlign: 'center' }}>
                  <div style={pageStyles.emptyState}>
                    <h3>No companies found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr 
                  key={company.id} 
                  style={{
                    ...pageStyles.tr,
                    ...(hoverStates.actionButtons[company.id] && pageStyles.trHover)
                  }}
                  onMouseEnter={() => handleMouseEnter(company.id, 'actionButtons')}
                  onMouseLeave={() => handleMouseLeave(company.id, 'actionButtons')}
                >
                  <td style={pageStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #f97316, #ec4899)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {(company?.name || 'CO').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>{company?.name || 'Unnamed Company'}</div>
                        {company?.website && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            <Globe size={12} />
                            <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{ 
                      background: '#f0f9ff',
                      color: '#0369a1',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {company?.industry || 'Not specified'}
                    </span>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#6b7280" />
                      {company?.email || 'No email'}
                    </div>
                    {company?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        <Phone size={12} />
                        {company.phone}
                      </div>
                    )}
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{
                      ...pageStyles.statusBadge,
                      ...(company?.status === 'active' ? pageStyles.statusActive : 
                           company?.status === 'pending' ? pageStyles.statusPending : pageStyles.statusSuspended)
                    }}>
                      {company?.status || 'pending'}
                    </span>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={pageStyles.actionButtons}>
                      {company?.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(company.id, 'active')}
                          style={{
                            ...pageStyles.approveButton,
                            ...(hoverStates.actionButtons[`approve-${company.id}`] && pageStyles.approveButtonHover)
                          }}
                          onMouseEnter={() => handleMouseEnter(`approve-${company.id}`, 'actionButtons')}
                          onMouseLeave={() => handleMouseLeave(`approve-${company.id}`, 'actionButtons')}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {company?.status === 'active' && (
                        <button 
                          onClick={() => handleStatusChange(company.id, 'suspended')}
                          style={{
                            ...pageStyles.suspendButton,
                            ...(hoverStates.actionButtons[`suspend-${company.id}`] && pageStyles.suspendButtonHover)
                          }}
                          onMouseEnter={() => handleMouseEnter(`suspend-${company.id}`, 'actionButtons')}
                          onMouseLeave={() => handleMouseLeave(`suspend-${company.id}`, 'actionButtons')}
                        >
                          <AlertTriangle size={14} />
                          Suspend
                        </button>
                      )}
                      {/* Add Delete Button */}
                      <button 
                        onClick={() => handleDelete(company.id)}
                        style={{
                          ...pageStyles.deleteButton,
                          ...(hoverStates.actionButtons[`delete-${company.id}`] && pageStyles.deleteButtonHover)
                        }}
                        onMouseEnter={() => handleMouseEnter(`delete-${company.id}`, 'actionButtons')}
                        onMouseLeave={() => handleMouseLeave(`delete-${company.id}`, 'actionButtons')}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// FacultiesPage Component
const FacultiesPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [facultiesResult, institutionsResult] = await Promise.all([
      getAllDocuments('faculties'),
      getAllDocuments('institutions')
    ]);
    
    if (facultiesResult.success) setFaculties(facultiesResult.data);
    if (institutionsResult.success) setInstitutions(institutionsResult.data);
    setLoading(false);
  };

  const getInstitutionName = (institutionId) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    return institution ? institution.name : 'Unknown Institution';
  };

  if (loading) {
    return (
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading faculties...</p>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>Manage Faculties</h2>
      </div>

      <div style={pageStyles.tableContainer}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Faculty Name</th>
              <th style={pageStyles.th}>Institution</th>
              <th style={pageStyles.th}>Dean</th>
              <th style={pageStyles.th}>Contact Email</th>
            </tr>
          </thead>
          <tbody>
            {faculties.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ ...pageStyles.td, textAlign: 'center' }}>
                  <div style={pageStyles.emptyState}>
                    
                    <h3>No faculties found</h3>
                    <p>Faculties will appear here when institutions create them</p>
                  </div>
                </td>
              </tr>
            ) : (
              faculties.map((faculty) => (
                <tr key={faculty.id} style={pageStyles.tr}>
                  <td style={pageStyles.td}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{faculty.name}</div>
                    {faculty.description && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {faculty.description}
                      </div>
                    )}
                  </td>
                  <td style={pageStyles.td}>{getInstitutionName(faculty.institutionId)}</td>
                  <td style={pageStyles.td}>{faculty.dean || 'Not specified'}</td>
                  <td style={pageStyles.td}>
                    {faculty.email ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} color="#6b7280" />
                        {faculty.email}
                      </div>
                    ) : (
                      'Not specified'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CoursesPage Component
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [coursesResult, institutionsResult, facultiesResult] = await Promise.all([
      getAllDocuments('courses'),
      getAllDocuments('institutions'),
      getAllDocuments('faculties')
    ]);
    
    if (coursesResult.success) setCourses(coursesResult.data);
    if (institutionsResult.success) setInstitutions(institutionsResult.data);
    if (facultiesResult.success) setFaculties(facultiesResult.data);
    setLoading(false);
  };

  const getInstitutionName = (institutionId) => {
    const institution = institutions.find(inst => inst.id === institutionId);
    return institution ? institution.name : 'Unknown Institution';
  };

  const getFacultyName = (facultyId) => {
    const faculty = faculties.find(fac => fac.id === facultyId);
    return faculty ? faculty.name : 'Unknown Faculty';
  };

  if (loading) {
    return (
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>Manage Courses</h2>
      </div>

      <div style={pageStyles.tableContainer}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Course Name</th>
              <th style={pageStyles.th}>Course Code</th>
              <th style={pageStyles.th}>Institution</th>
              <th style={pageStyles.th}>Faculty</th>
              <th style={pageStyles.th}>Duration</th>
              <th style={pageStyles.th}>Admission Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...pageStyles.td, textAlign: 'center' }}>
                  <div style={pageStyles.emptyState}>
                    
                    <h3>No courses found</h3>
                    <p>Courses will appear here when institutions create them</p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} style={pageStyles.tr}>
                  <td style={pageStyles.td}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{course.courseName}</div>
                    {course.description && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...` 
                          : course.description
                        }
                      </div>
                    )}
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#f97316',
                      background: '#fffbeb',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {course.courseCode}
                    </span>
                  </td>
                  <td style={pageStyles.td}>{getInstitutionName(course.institutionId)}</td>
                  <td style={pageStyles.td}>{getFacultyName(course.facultyId)}</td>
                  <td style={pageStyles.td}>{course.duration || 'Not specified'}</td>
                  <td style={pageStyles.td}>
                    <span style={{
                      ...pageStyles.statusBadge,
                      ...(course.admissionStatus === 'open' ? pageStyles.statusActive : pageStyles.statusSuspended)
                    }}>
                      {course.admissionStatus || 'closed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// AdmissionsPage Component
const AdmissionsPage = ({ refreshStats }) => {
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [applicationsResult, studentsResult, coursesResult, institutionsResult] = await Promise.all([
      getAllDocuments('applications'),
      queryDocuments('users', [{ field: 'role', operator: '==', value: 'student' }]),
      getAllDocuments('courses'),
      getAllDocuments('institutions')
    ]);
    
    if (applicationsResult.success) setApplications(applicationsResult.data);
    if (studentsResult.success) setStudents(studentsResult.data);
    if (coursesResult.success) setCourses(coursesResult.data);
    if (institutionsResult.success) setInstitutions(institutionsResult.data);
    setLoading(false);
  };

  const getStudentName = (studentId) => {
    const student = students.find(st => st.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.courseName : 'Unknown Course';
  };

  const getInstitutionName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 'Unknown Institution';
    
    const institution = institutions.find(inst => inst.id === course.institutionId);
    return institution ? institution.name : 'Unknown Institution';
  };

  const handleAdmissionStatus = async (applicationId, status) => {
    const result = await updateDocument('applications', applicationId, { status });
    if (result.success) {
      loadData();
      refreshStats();
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  if (loading) {
    return (
      <div style={pageStyles.loadingContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading admissions...</p>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>Publish Admissions</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Total: {applications.length} | 
            Admitted: {applications.filter(app => app.status === 'admitted').length} | 
            Pending: {applications.filter(app => app.status === 'pending').length}
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={pageStyles.filterSelect}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="admitted">Admitted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={pageStyles.tableContainer}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Student</th>
              <th style={pageStyles.th}>Course</th>
              <th style={pageStyles.th}>Institution</th>
              <th style={pageStyles.th}>Applied Date</th>
              <th style={pageStyles.th}>Status</th>
              <th style={pageStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...pageStyles.td, textAlign: 'center' }}>
                  <div style={pageStyles.emptyState}>
                    
                    <h3>No applications found</h3>
                    <p>Try adjusting your filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr key={application.id} style={pageStyles.tr}>
                  <td style={pageStyles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'linear-gradient(135deg, #f97316, #ec4899)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {getStudentName(application.studentId).split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {getStudentName(application.studentId)}
                      </div>
                    </div>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={{ fontWeight: '500' }}>{getCourseName(application.courseId)}</div>
                  </td>
                  <td style={pageStyles.td}>{getInstitutionName(application.courseId)}</td>
                  <td style={pageStyles.td}>
                    {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={pageStyles.td}>
                    <span style={{
                      ...pageStyles.statusBadge,
                      ...(application.status === 'admitted' ? pageStyles.statusActive : 
                           application.status === 'rejected' ? pageStyles.statusSuspended : pageStyles.statusPending)
                    }}>
                      {application.status || 'pending'}
                    </span>
                  </td>
                  <td style={pageStyles.td}>
                    <div style={pageStyles.actionButtons}>
                      {application.status !== 'admitted' && (
                        <button 
                          onClick={() => handleAdmissionStatus(application.id, 'admitted')}
                          style={pageStyles.approveButton}
                        >
                          <CheckCircle size={14} />
                          Admit
                        </button>
                      )}
                      {application.status !== 'rejected' && (
                        <button 
                          onClick={() => handleAdmissionStatus(application.id, 'rejected')}
                          style={pageStyles.deleteButton}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ReportsPage Component
const ReportsPage = ({ stats }) => {
  const [reportData, setReportData] = useState({
    monthlyApplications: [],
    institutionStats: [],
    popularCourses: [],
    companyStats: []
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    // Simulate loading report data
    // In a real app, you'd fetch this from your backend
    const monthlyData = [
      { month: 'Jan', applications: 45, admissions: 32 },
      { month: 'Feb', applications: 52, admissions: 38 },
      { month: 'Mar', applications: 48, admissions: 35 },
      { month: 'Apr', applications: 67, admissions: 45 },
      { month: 'May', applications: 71, admissions: 52 },
      { month: 'Jun', applications: 65, admissions: 48 }
    ];

    const institutionData = [
      { name: 'University of Excellence', students: 150, courses: 25 },
      { name: 'National University', students: 120, courses: 20 },
      { name: 'Technical Institute', students: 90, courses: 18 },
      { name: 'Business College', students: 75, courses: 15 }
    ];

    const courseData = [
      { name: 'Computer Science', applications: 45 },
      { name: 'Business Administration', applications: 38 },
      { name: 'Electrical Engineering', applications: 32 },
      { name: 'Medicine', applications: 28 },
      { name: 'Law', applications: 25 }
    ];

    const companyData = [
      { name: 'Tech Solutions Inc', jobs: 12, applicants: 45 },
      { name: 'Business Partners Ltd', jobs: 8, applicants: 32 },
      { name: 'Innovation Group', jobs: 6, applicants: 28 },
      { name: 'Global Enterprises', jobs: 10, applicants: 38 }
    ];

    setReportData({
      monthlyApplications: monthlyData,
      institutionStats: institutionData,
      popularCourses: courseData,
      companyStats: companyData
    });
  };

  const exportReport = (type) => {
    // Implement export functionality
    alert(`Exporting ${type} report as CSV...`);
  };

  const reportStyles = {
    reportsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    reportCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s'
    },
    reportCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    reportTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    exportButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.3s'
    },
    exportButtonHover: {
      backgroundColor: '#ea580c',
      transform: 'scale(1.05)'
    },
    chartContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0.5rem',
      height: '200px',
      padding: '1rem 0',
      justifyContent: 'center'
    },
    chartBar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      gap: '0.5rem',
      maxWidth: '50px'
    },
    chartFill: {
      width: '100%',
      backgroundColor: '#f97316',
      borderRadius: '0.25rem',
      minHeight: '10px',
      transition: 'height 0.3s ease'
    },
    chartLabel: {
      fontSize: '0.75rem',
      color: '#6b7280',
      textAlign: 'center'
    },
    chartValue: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151'
    },
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#fffbeb',
      borderRadius: '0.5rem',
      transition: 'all 0.3s'
    },
    listItemHover: {
      backgroundColor: '#fed7aa'
    },
    listText: {
      color: '#374151',
      fontWeight: '500',
      fontSize: '0.875rem'
    },
    listNumber: {
      color: '#f97316',
      fontWeight: '600',
      fontSize: '0.875rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statItem: {
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#fffbeb',
      borderRadius: '0.5rem'
    },
    statNumber: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#f97316',
      display: 'block'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.25rem'
    }
  };

  const [hoverStates, setHoverStates] = useState({
    reportCards: {},
    exportButtons: {},
    listItems: {}
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

  const maxApplications = Math.max(...reportData.monthlyApplications.map(item => item.applications));

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>System Reports</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            style={pageStyles.addButton}
            onClick={() => exportReport('full')}
          >
            <Download size={20} />
            Export Full Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={reportStyles.statsGrid}>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalUsers}</span>
          <span style={reportStyles.statLabel}>Total Users</span>
        </div>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalStudents}</span>
          <span style={reportStyles.statLabel}>Students</span>
        </div>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalInstitutions}</span>
          <span style={reportStyles.statLabel}>Institutions</span>
        </div>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalCompanies}</span>
          <span style={reportStyles.statLabel}>Companies</span>
        </div>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalCourses}</span>
          <span style={reportStyles.statLabel}>Courses</span>
        </div>
        <div style={reportStyles.statItem}>
          <span style={reportStyles.statNumber}>{stats.totalApplications}</span>
          <span style={reportStyles.statLabel}>Applications</span>
        </div>
      </div>

      <div style={reportStyles.reportsGrid}>
        {/* Applications Trend */}
        <div 
          style={{
            ...reportStyles.reportCard,
            ...(hoverStates.reportCards.applications && reportStyles.reportCardHover)
          }}
          onMouseEnter={() => handleMouseEnter('applications', 'reportCards')}
          onMouseLeave={() => handleMouseLeave('applications', 'reportCards')}
        >
          <div style={reportStyles.reportTitle}>
            <span>Applications Trend</span>
            <button 
              style={{
                ...reportStyles.exportButton,
                ...(hoverStates.exportButtons.applications && reportStyles.exportButtonHover)
              }}
              onMouseEnter={() => handleMouseEnter('applications', 'exportButtons')}
              onMouseLeave={() => handleMouseLeave('applications', 'exportButtons')}
              onClick={() => exportReport('applications')}
            >
              Export
            </button>
          </div>
          <div style={reportStyles.chartContainer}>
            {reportData.monthlyApplications.map((item, index) => (
              <div key={index} style={reportStyles.chartBar}>
                <div 
                  style={{
                    ...reportStyles.chartFill,
                    height: `${(item.applications / maxApplications) * 100}%`
                  }}
                ></div>
                <span style={reportStyles.chartLabel}>{item.month}</span>
                <span style={reportStyles.chartValue}>{item.applications}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Institutions */}
        <div 
          style={{
            ...reportStyles.reportCard,
            ...(hoverStates.reportCards.institutions && reportStyles.reportCardHover)
          }}
          onMouseEnter={() => handleMouseEnter('institutions', 'reportCards')}
          onMouseLeave={() => handleMouseLeave('institutions', 'reportCards')}
        >
          <div style={reportStyles.reportTitle}>
            <span>Top Institutions</span>
            <button 
              style={{
                ...reportStyles.exportButton,
                ...(hoverStates.exportButtons.institutions && reportStyles.exportButtonHover)
              }}
              onMouseEnter={() => handleMouseEnter('institutions', 'exportButtons')}
              onMouseLeave={() => handleMouseLeave('institutions', 'exportButtons')}
              onClick={() => exportReport('institutions')}
            >
              Export
            </button>
          </div>
          <div style={reportStyles.listContainer}>
            {reportData.institutionStats.map((institution, index) => (
              <div 
                key={index}
                style={{
                  ...reportStyles.listItem,
                  ...(hoverStates.listItems[`inst-${index}`] && reportStyles.listItemHover)
                }}
                onMouseEnter={() => handleMouseEnter(`inst-${index}`, 'listItems')}
                onMouseLeave={() => handleMouseLeave(`inst-${index}`, 'listItems')}
              >
                <span style={reportStyles.listText}>{institution.name}</span>
                <span style={reportStyles.listNumber}>{institution.students} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Courses */}
        <div 
          style={{
            ...reportStyles.reportCard,
            ...(hoverStates.reportCards.courses && reportStyles.reportCardHover)
          }}
          onMouseEnter={() => handleMouseEnter('courses', 'reportCards')}
          onMouseLeave={() => handleMouseLeave('courses', 'reportCards')}
        >
          <div style={reportStyles.reportTitle}>
            <span>Popular Courses</span>
            <button 
              style={{
                ...reportStyles.exportButton,
                ...(hoverStates.exportButtons.courses && reportStyles.exportButtonHover)
              }}
              onMouseEnter={() => handleMouseEnter('courses', 'exportButtons')}
              onMouseLeave={() => handleMouseLeave('courses', 'exportButtons')}
              onClick={() => exportReport('courses')}
            >
              Export
            </button>
          </div>
          <div style={reportStyles.listContainer}>
            {reportData.popularCourses.map((course, index) => (
              <div 
                key={index}
                style={{
                  ...reportStyles.listItem,
                  ...(hoverStates.listItems[`course-${index}`] && reportStyles.listItemHover)
                }}
                onMouseEnter={() => handleMouseEnter(`course-${index}`, 'listItems')}
                onMouseLeave={() => handleMouseLeave(`course-${index}`, 'listItems')}
              >
                <span style={reportStyles.listText}>{course.name}</span>
                <span style={reportStyles.listNumber}>{course.applications} apps</span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Activity */}
        <div 
          style={{
            ...reportStyles.reportCard,
            ...(hoverStates.reportCards.companies && reportStyles.reportCardHover)
          }}
          onMouseEnter={() => handleMouseEnter('companies', 'reportCards')}
          onMouseLeave={() => handleMouseLeave('companies', 'reportCards')}
        >
          <div style={reportStyles.reportTitle}>
            <span>Company Activity</span>
            <button 
              style={{
                ...reportStyles.exportButton,
                ...(hoverStates.exportButtons.companies && reportStyles.exportButtonHover)
              }}
              onMouseEnter={() => handleMouseEnter('companies', 'exportButtons')}
              onMouseLeave={() => handleMouseLeave('companies', 'exportButtons')}
              onClick={() => exportReport('companies')}
            >
              Export
            </button>
          </div>
          <div style={reportStyles.listContainer}>
            {reportData.companyStats.map((company, index) => (
              <div 
                key={index}
                style={{
                  ...reportStyles.listItem,
                  ...(hoverStates.listItems[`company-${index}`] && reportStyles.listItemHover)
                }}
                onMouseEnter={() => handleMouseEnter(`company-${index}`, 'listItems')}
                onMouseLeave={() => handleMouseLeave(`company-${index}`, 'listItems')}
              >
                <span style={reportStyles.listText}>{company.name}</span>
                <span style={reportStyles.listNumber}>{company.jobs} jobs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// SettingsPage Component
const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'Thuto Pele Career Connect',
    maintenanceMode: false,
    studentApplications: true,
    companyRegistrations: true,
    institutionRegistrations: true,
    emailNotifications: true,
    autoApproveInstitutions: false,
    autoApproveCompanies: false
  });

  const handleSaveSettings = async () => {
    // Implement settings save functionality
    alert('Settings saved successfully!');
  };

  const settingStyles = {
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    settingCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    settingTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #fed7aa'
    },
    settingGroup: {
      marginBottom: '1.5rem'
    },
    settingLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#374151'
    },
    textInput: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem'
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    checkbox: {
      width: '1rem',
      height: '1rem'
    },
    saveButton: {
      padding: '0.75rem 2rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    saveButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
    }
  };

  const [hoverState, setHoverState] = useState(false);

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.pageHeader}>
        <h2 style={pageStyles.pageTitle}>System Settings</h2>
        <button 
          style={{
            ...settingStyles.saveButton,
            ...(hoverState && settingStyles.saveButtonHover)
          }}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          onClick={handleSaveSettings}
        >
          Save Settings
        </button>
      </div>

      <div style={settingStyles.settingsGrid}>
        {/* General Settings */}
        <div style={settingStyles.settingCard}>
          <h3 style={settingStyles.settingTitle}>General Settings</h3>
          <div style={settingStyles.settingGroup}>
            <label style={settingStyles.settingLabel}>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              style={settingStyles.textInput}
            />
          </div>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Maintenance Mode</label>
          </div>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Email Notifications</label>
          </div>
        </div>

        {/* Registration Settings */}
        <div style={settingStyles.settingCard}>
          <h3 style={settingStyles.settingTitle}>Registration Settings</h3>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.studentApplications}
              onChange={(e) => setSettings({...settings, studentApplications: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Allow Student Registrations</label>
          </div>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.institutionRegistrations}
              onChange={(e) => setSettings({...settings, institutionRegistrations: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Allow Institution Registrations</label>
          </div>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.companyRegistrations}
              onChange={(e) => setSettings({...settings, companyRegistrations: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Allow Company Registrations</label>
          </div>
        </div>

        {/* Approval Settings */}
        <div style={settingStyles.settingCard}>
          <h3 style={settingStyles.settingTitle}>Approval Settings</h3>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.autoApproveInstitutions}
              onChange={(e) => setSettings({...settings, autoApproveInstitutions: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Auto-approve Institutions</label>
          </div>
          <div style={settingStyles.checkboxGroup}>
            <input
              type="checkbox"
              checked={settings.autoApproveCompanies}
              onChange={(e) => setSettings({...settings, autoApproveCompanies: e.target.checked})}
              style={settingStyles.checkbox}
            />
            <label style={settingStyles.settingLabel}>Auto-approve Companies</label>
          </div>
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

export default AdminDashboard;