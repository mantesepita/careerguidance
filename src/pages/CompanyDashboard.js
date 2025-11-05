import React, { useState } from 'react';
import { Home, Building2, Briefcase, Users, Send, LogOut, Menu, X, Bell, Plus, TrendingUp } from 'lucide-react';

const CompanyDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const companyData = {
    name: 'Tech Solutions Inc.',
    email: 'hr@techsolutions.com',
    industry: 'Technology'
  };

  const stats = {
    activeJobs: 12,
    totalApplicants: 156,
    shortlisted: 32,
    invitationsSent: 45
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
        return <HomePage companyData={companyData} stats={stats} setActivePage={setActivePage} />;
      case 'profile':
        return <ProfilePage />;
      case 'postJob':
        return <PostJobPage />;
      case 'applicants':
        return <ApplicantsPage stats={stats} />;
      case 'invitations':
        return <InvitationsPage />;
      default:
        return <HomePage companyData={companyData} stats={stats} setActivePage={setActivePage} />;
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
              <div style={styles.logoIcon}>
                <Building2 size={24} color="white" />
              </div>
              <div>
                <h1 style={styles.logoText}>Company Panel</h1>
                <p style={styles.logoSubtext}>Recruitment Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div style={styles.desktopNav}>
              <button 
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
                  <p style={styles.userName}>{companyData.name}</p>
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

const HomePage = ({ companyData, stats, setActivePage }) => {
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
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      trend: { color: '#16a34a', text: '+2 this week' }
    },
    { 
      key: 'totalApplicants', 
      number: stats.totalApplicants, 
      label: 'Total Applicants', 
      icon: Users, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      trend: { color: '#2563eb', text: '+15 this week' }
    },
    { 
      key: 'shortlisted', 
      number: stats.shortlisted, 
      label: 'Shortlisted', 
      icon: Users, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      trend: { color: '#16a34a', text: 'Ready to review' }
    },
    { 
      key: 'invitationsSent', 
      number: stats.invitationsSent, 
      label: 'Invitations Sent', 
      icon: Send, 
      iconColor: 'white',
      gradient: 'linear-gradient(135deg, #f97316, #ec4899)',
      trend: { color: '#ea580c', text: '+8 this week' }
    }
  ];

  const activities = [
    {
      key: 'applications',
      title: '15 new applications received',
      description: 'For Senior Developer position',
      time: '2 hours ago',
      icon: Users,
      color: '#3b82f6',
      background: 'linear-gradient(to right, #dbeafe, #dbeafe80)'
    },
    {
      key: 'invitations',
      title: 'Interview invitation sent',
      description: 'To 5 shortlisted candidates',
      time: '5 hours ago',
      icon: Send,
      color: '#10b981',
      background: 'linear-gradient(to right, #dcfce7, #dcfce780)'
    },
    {
      key: 'jobPost',
      title: 'New job post published',
      description: 'Marketing Manager position',
      time: '1 day ago',
      icon: Briefcase,
      color: '#8b5cf6',
      background: 'linear-gradient(to right, #f3e8ff, #f3e8ff80)'
    }
  ];

  const quickActions = [
    {
      key: 'postJob',
      title: 'Post New Job',
      text: 'Create and publish a new job opening',
      icon: Plus,
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      onClick: () => setActivePage('postJob')
    },
    {
      key: 'applicants',
      title: 'Review Applicants',
      text: 'Browse and review candidate applications',
      icon: Users,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
          <h1 style={styles.welcomeTitle}>Welcome back! 💼</h1>
          <p style={styles.welcomeSubtitle}>{companyData.name}</p>
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
          {activities.map((activity) => {
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
          })}
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

// Placeholder components for other pages
const ProfilePage = () => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #fed7aa',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
      Company Profile
    </h2>
    <p style={{ color: '#6b7280' }}>Profile management interface would go here...</p>
  </div>
);

const PostJobPage = () => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #fed7aa',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
      Post New Job
    </h2>
    <p style={{ color: '#6b7280' }}>Job posting form would go here...</p>
  </div>
);

const ApplicantsPage = ({ stats }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
          View Applicants
        </h2>
        <span style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#f3e8ff',
          color: '#7c3aed',
          borderRadius: '9999px',
          fontWeight: 600
        }}>
          {stats.totalApplicants} Total
        </span>
      </div>
      <p style={{ color: '#6b7280' }}>Applicants management interface would go here...</p>
    </div>
  </div>
);

const InvitationsPage = () => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #fed7aa',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
      Send Invitations
    </h2>
    <p style={{ color: '#6b7280' }}>Invitation management interface would go here...</p>
  </div>
);

export default CompanyDashboard;