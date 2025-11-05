import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      
      if (result.success) {
        console.log('Registration successful', result);
        
        // Get user role from result
        const userRole = result.userData?.role || formData.role;
        
        // Navigate based on role with fallback
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'student') {
          navigate('/student');
        } else if (userRole === 'institute' || userRole === 'institution') {
          navigate('/institute');
        } else if (userRole === 'company') {
          navigate('/company');
        } else {
          // Fallback if role is undefined or unknown
          console.warn('Unknown or undefined role:', userRole);
          navigate('/dashboard'); // Fallback route
        }
      } else {
        setError(result.error || 'Failed to register');
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    }
    
    setLoading(false);
  };

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'institute', label: 'Institute' },
    { value: 'company', label: 'Company' }
  ];

  // Inline styles matching the orange-pink theme
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, #fffbeb, #fef2f2, #fffbeb)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    backgroundElements: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    },
    blob1: {
      position: 'absolute',
      top: '5rem',
      left: '2.5rem',
      width: '18rem',
      height: '18rem',
      background: '#fdba74',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(48px)',
      opacity: 0.2,
      animation: 'blob 7s infinite'
    },
    blob2: {
      position: 'absolute',
      top: '10rem',
      right: '2.5rem',
      width: '18rem',
      height: '18rem',
      background: '#f9a8d4',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(48px)',
      opacity: 0.2,
      animation: 'blob 7s infinite 2s'
    },
    registerCard: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      transition: 'transform 0.3s'
    },
    glassCard: {
      backdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #fed7aa',
      overflow: 'hidden',
      position: 'relative'
    },
    cardContent: {
      position: 'relative',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    iconContainer: {
      display: 'inline-flex',
      padding: '1rem',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#4b5563',
      fontSize: '1rem'
    },
    errorContainer: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(254, 226, 226, 0.8)',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      animation: 'shake 0.5s ease-in-out'
    },
    errorContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    errorText: {
      color: '#dc2626',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    formGroup: {
      position: 'relative'
    },
    label: {
      display: 'block',
      color: '#374151',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    inputContainer: {
      position: 'relative'
    },
    inputGlow: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      borderRadius: '0.5rem',
      filter: 'blur(8px)',
      transition: 'opacity 0.3s',
      opacity: 0
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingRight: '2.5rem',
      backgroundColor: 'white',
      border: '1px solid #fed7aa',
      borderRadius: '0.5rem',
      color: '#374151',
      fontSize: '0.875rem',
      transition: 'all 0.3s',
      outline: 'none'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingRight: '2.5rem',
      backgroundColor: 'white',
      border: '1px solid #fed7aa',
      borderRadius: '0.5rem',
      color: '#374151',
      fontSize: '0.875rem',
      transition: 'all 0.3s',
      outline: 'none',
      appearance: 'none'
    },
    inputFocus: {
      borderColor: '#fdba74',
      boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
    },
    inputDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    inputIcon: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none'
    },
    button: {
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '0.5rem'
    },
    buttonDisabled: {
      cursor: 'not-allowed',
      opacity: 0.7
    },
    buttonGradient: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, #f97316, #ec4899)'
    },
    buttonContent: {
      position: 'relative',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1rem'
    },
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center'
    },
    footerText: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    link: {
      color: '#dc2626',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'color 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    linkHover: {
      color: '#ec4899'
    },
    option: {
      backgroundColor: 'white',
      color: '#374151'
    }
  };

  return (
    <div style={styles.container}>
      {/* Background elements */}
      <div style={styles.backgroundElements}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>

      {/* Register card */}
      <div style={styles.registerCard}>
        <div style={styles.glassCard}>
          <div style={styles.cardContent}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.iconContainer}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 style={styles.title}>
                Create Account
              </h1>
              <p style={styles.subtitle}>
                Join Our Career Guidance Platform
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span style={styles.errorText}>{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'name' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={loading}
                      placeholder="Enter your full name"
                      style={{
                        ...styles.input,
                        ...(focusedField === 'name' && styles.inputFocus),
                        ...(loading && styles.inputDisabled)
                      }}
                    />
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'email' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={loading}
                      placeholder="Enter your email"
                      style={{
                        ...styles.input,
                        ...(focusedField === 'email' && styles.inputFocus),
                        ...(loading && styles.inputDisabled)
                      }}
                    />
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>I am a</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'role' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('role')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      style={{
                        ...styles.select,
                        ...(focusedField === 'role' && styles.inputFocus),
                        ...(loading && styles.inputDisabled)
                      }}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value} style={styles.option}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'password' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={6}
                      disabled={loading}
                      placeholder="Enter your password"
                      style={{
                        ...styles.input,
                        ...(focusedField === 'password' && styles.inputFocus),
                        ...(loading && styles.inputDisabled)
                      }}
                    />
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'confirmPassword' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={6}
                      disabled={loading}
                      placeholder="Confirm your password"
                      style={{
                        ...styles.input,
                        ...(focusedField === 'confirmPassword' && styles.inputFocus),
                        ...(loading && styles.inputDisabled)
                      }}
                    />
                    <div style={styles.inputIcon}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading && styles.buttonDisabled)
                }}
              >
                <div style={styles.buttonGradient}></div>
                <div style={styles.buttonContent}>
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Footer */}
            <div style={styles.footer}>
              <p style={styles.footerText}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={styles.link}
                >
                  Sign in here
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder,
        select::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Register;