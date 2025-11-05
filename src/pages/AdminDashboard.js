import React, { useState } from 'react';
import { Home, Shield, Building, Building2, BarChart3, Settings, LogOut, Menu, X, Bell, Users, BookOpen, FileText, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const adminData = {
    email: 'admin@system.com',
    role: 'Administrator'
  };

  const stats = {
    totalUsers: 1247,
    totalInstitutions: 45,
    totalCompanies: 128,
    totalStudents: 892,
    totalCourses: 256,
    totalApplications: 3421,
    pendingInstitutions: 8,
    pendingCompanies: 12
  };

  const navigation = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'institutions', label: 'Manage Institutions', icon: Building, badge: stats.pendingInstitutions },
    { id: 'companies', label: 'Manage Companies', icon: Building2, badge: stats.pendingCompanies },
    { id: 'reports', label: 'System Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch(activePage) {
      case 'home':
        return <HomePage stats={stats} setActivePage={setActivePage} />;
      case 'institutions':
        return <InstitutionsPage stats={stats} />;
      case 'companies':
        return <CompaniesPage stats={stats} />;
      case 'reports':
        return <ReportsPage stats={stats} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage stats={stats} setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fff1f2 50%, #fffbeb 100%)'
    }}>
      {/* Top Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #fed7aa'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <Shield style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #dc2626, #db2777)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Admin Portal
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>System Administration</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div style={{ 
              display: 'none', 
              alignItems: 'center', 
              gap: '1.5rem',
              '@media (min-width: 768px)': { display: 'flex' }
            }}>
              <button style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s'
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#ffedd5'} 
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                <Bell style={{ width: '1.25rem', height: '1.25rem', color: '#4b5563' }} />
                {(stats.pendingInstitutions + stats.pendingCompanies) > 0 && (
                  <span style={{
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
                  }}>
                    {stats.pendingInstitutions + stats.pendingCompanies}
                  </span>
                )}
              </button>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                paddingLeft: '1rem',
                borderLeft: '1px solid #fed7aa'
              }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{adminData.email}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{adminData.role}</p>
                </div>
                <button style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }} onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'} 
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
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
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s',
                '@media (min-width: 768px)': { display: 'none' }
              }} onMouseOver={(e) => e.target.style.backgroundColor = '#ffedd5'} 
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
              {isMobileMenuOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          top: '4rem',
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          '@media (min-width: 768px)': { display: 'none' }
        }}>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s',
                    position: 'relative',
                    background: isActive 
                      ? 'linear-gradient(to right, #f97316, #ec4899)'
                      : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }} onMouseOver={(e) => {
                    if (!isActive) e.target.style.backgroundColor = '#ffedd5';
                  }} onMouseOut={(e) => {
                    if (!isActive) e.target.style.backgroundColor = 'transparent';
                  }}>
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
          display: 'none',
          width: '18rem',
          minHeight: '100vh',
          padding: '1.5rem',
          '@media (min-width: 768px)': { display: 'block' }
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s',
                    position: 'relative',
                    background: isActive 
                      ? 'linear-gradient(to right, #f97316, #ec4899)'
                      : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }} onMouseOver={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }
                  }} onMouseOut={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }
                  }}>
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
        <main style={{ flex: 1, padding: '1.5rem' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const HomePage = ({ stats, setActivePage }) => {
  const totalPending = stats.pendingInstitutions + stats.pendingCompanies;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Section */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #f97316, #ec4899)',
        borderRadius: '1rem',
        padding: '2rem',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '16rem',
          height: '16rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          marginRight: '-8rem',
          marginTop: '-8rem'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '12rem',
          height: '12rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          marginLeft: '-6rem',
          marginBottom: '-6rem'
        }}></div>
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            System Overview 🛡️
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem' }}>
            Monitor and manage the entire platform
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '1.5rem',
        '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
        '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, 1fr)' }
      }}>
        {[
          { value: stats.totalUsers, label: 'Total Users', icon: Users, color: 'from-blue-500 to-blue-600', trend: '+45 this month' },
          { value: stats.totalStudents, label: 'Students', icon: Users, color: 'from-purple-500 to-purple-600', trend: '+32 this month' },
          { value: stats.totalInstitutions, label: 'Institutions', icon: Building, color: 'from-green-500 to-green-600', trend: `${stats.totalInstitutions - stats.pendingInstitutions} active` },
          { value: stats.totalCompanies, label: 'Companies', icon: Building2, color: 'from-orange-500 to-orange-600', trend: `${stats.totalCompanies - stats.pendingCompanies} active` },
          { value: stats.totalCourses, label: 'Total Courses', icon: BookOpen, color: 'from-pink-500 to-pink-600', trend: '+18 this month' },
          { value: stats.totalApplications, label: 'Applications', icon: FileText, color: 'from-indigo-500 to-indigo-600', trend: '+124 this month' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #fed7aa',
              transition: 'all 0.3s',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }} onMouseOver={(e) => {
              e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(-0.25rem)';
            }} onMouseOut={(e) => {
              e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <span style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</span>
              </div>
              <p style={{ color: '#4b5563', fontWeight: 500 }}>{stat.label}</p>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.875rem' }}>
                <TrendingUp style={{ width: '1rem', height: '1rem' }} />
                <span>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Approvals Alert */}
      {totalPending > 0 && (
        <div style={{
          background: 'linear-gradient(to right, #fef2f2, #fdf2f8)',
          border: '2px solid #fca5a5',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#ef4444',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7f1d1d', marginBottom: '0.5rem' }}>Pending Approvals</h3>
              <p style={{ color: '#991b1b', marginBottom: '1rem' }}>
                You have {totalPending} pending approval{totalPending !== 1 ? 's' : ''} requiring your attention.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '1rem',
                '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' }
              }}>
                {stats.pendingInstitutions > 0 && (
                  <button 
                    onClick={() => setActivePage('institutions')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      border: '2px solid #fca5a5',
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s'
                    }} onMouseOver={(e) => {
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'scale(1.05)';
                    }} onMouseOut={(e) => {
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      border: '2px solid #fca5a5',
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s'
                    }} onMouseOver={(e) => {
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      e.target.style.transform = 'scale(1.05)';
                    }} onMouseOut={(e) => {
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '1.5rem',
          '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
          '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' }
        }}>
          {[
            { label: 'Review Institutions', icon: Building, color: 'from-green-500 to-green-600', page: 'institutions', description: 'Approve or suspend institutions' },
            { label: 'Review Companies', icon: Building2, color: 'from-orange-500 to-orange-600', page: 'companies', description: 'Manage company registrations' },
            { label: 'View Reports', icon: BarChart3, color: 'from-blue-500 to-blue-600', page: 'reports', description: 'Generate system reports' },
            { label: 'System Settings', icon: Settings, color: 'from-purple-500 to-purple-600', page: 'settings', description: 'Configure platform settings' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                onClick={() => setActivePage(action.page)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid #fed7aa',
                  transition: 'all 0.3s',
                  textAlign: 'left'
                }} onMouseOver={(e) => {
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  e.target.style.transform = 'translateY(-0.5rem)';
                }} onMouseOut={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: `linear-gradient(135deg, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})`,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  transition: 'transform 0.3s'
                }} onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }} onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}>
                  <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>{action.label}</h3>
                <p style={{ color: '#4b5563' }}>{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const InstitutionsPage = ({ stats }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Manage Institutions</h2>
        <span style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderRadius: '9999px',
          fontWeight: 600
        }}>
          {stats.pendingInstitutions} Pending
        </span>
      </div>
      <p style={{ color: '#4b5563' }}>Institution management interface would go here...</p>
    </div>
  </div>
);

const CompaniesPage = ({ stats }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>Manage Companies</h2>
        <span style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderRadius: '9999px',
          fontWeight: 600
        }}>
          {stats.pendingCompanies} Pending
        </span>
      </div>
      <p style={{ color: '#4b5563' }}>Company management interface would go here...</p>
    </div>
  </div>
);

const ReportsPage = ({ stats }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fed7aa',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>System Reports</h2>
      <p style={{ color: '#4b5563' }}>Reports and analytics would go here...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #fed7aa',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }}>
    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>System Settings</h2>
    <p style={{ color: '#4b5563' }}>System configuration options would go here...</p>
  </div>
);

export default AdminDashboard;