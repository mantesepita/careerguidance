import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from './logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login successful', result);
        
        // Get user role from result
        const userRole = result.userData?.role || result.role;
        
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
        setError(result.error || 'Failed to login');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', err);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      const result = await resetPassword(resetEmail);
      
      if (result.success) {
        setResetSuccess('✅ Password reset email sent! Check your inbox.');
        setResetEmail('');
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetSuccess('');
        }, 3000);
      } else {
        setResetError(result.error || 'Failed to send reset email');
      }
    } catch (err) {
      setResetError('Failed to send reset email. Please try again.');
      console.error('Reset password error:', err);
    }
    
    setResetLoading(false);
  };

  // Updated inline styles to match orange-pink theme
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
    loginCard: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      transition: 'all 0.3s'
    },
    glassCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
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
      marginBottom: '2rem'
    },
    iconContainer: {
      display: 'inline-flex',
      padding: '1rem',
      background: 'linear-gradient(135deg, #f97316, #ec4899)',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s'
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
    successContainer: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(220, 252, 231, 0.8)',
      border: '1px solid #bbf7d0',
      borderRadius: '0.5rem'
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
    successText: {
      color: '#16a34a',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
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
    inputWrapper: {
      position: 'relative'
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
      color: '#9ca3af'
    },
    forgotPasswordLink: {
      textAlign: 'right',
      marginTop: '-0.75rem'
    },
    forgotPasswordText: {
      color: '#dc2626',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.3s'
    },
    button: {
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s'
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
    buttonHover: {
      background: 'linear-gradient(to right, #ec4899, #f97316)'
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
    bottomGlow: {
      position: 'absolute',
      bottom: '-1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '50%',
      height: '2rem',
      background: 'linear-gradient(to right, #f97316, #ec4899)',
      filter: 'blur(12px)',
      opacity: 0.3,
      borderRadius: '50%'
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid #fed7aa',
      animation: 'slideUp 0.3s ease-out'
    },
    modalHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #fed7aa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    modalClose: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'background-color 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalBody: {
      padding: '1.5rem'
    },
    modalDescription: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '1.5rem',
      lineHeight: '1.5'
    }
  };

  return (
    <div style={styles.container}>
      {/* Background elements */}
      <div style={styles.backgroundElements}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>

      {/* Login card */}
      <div 
        style={{
          ...styles.loginCard,
          transform: isHovering ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Glassmorphism card */}
        <div style={styles.glassCard}>
          <div style={styles.cardContent}>
            {/* Header */}
            <div style={styles.header}>
              <div>
                <img 
                  src={logo}
                  alt="logo" 
                  width="50" 
                  height="75"
                />
              </div>
              <h1 style={styles.title}>
                Welcome Back
              </h1>
              <p style={styles.subtitle}>
                Thuto Pele Career Connect
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
              {/* Email field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'email' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={styles.inputWrapper}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

              {/* Password field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputContainer}>
                  <div 
                    style={{
                      ...styles.inputGlow,
                      opacity: focusedField === 'password' ? 0.3 : 0
                    }}
                  ></div>
                  <div style={styles.inputWrapper}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password Link */}
              <div style={styles.forgotPasswordLink}>
                <span 
                  style={styles.forgotPasswordText}
                  onClick={() => setShowForgotPassword(true)}
                  onMouseEnter={(e) => e.target.style.color = '#ec4899'}
                  onMouseLeave={(e) => e.target.style.color = '#dc2626'}
                >
                  Forgot Password?
                </span>
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      Sign In
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
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={styles.link}
                >
                  Create one now
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div style={styles.bottomGlow}></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={styles.modalOverlay} onClick={() => setShowForgotPassword(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Reset Password</h2>
              <button 
                style={styles.modalClose}
                onClick={() => setShowForgotPassword(false)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fed7aa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <p style={styles.modalDescription}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* Success message */}
              {resetSuccess && (
                <div style={styles.successContainer}>
                  <div style={styles.errorContent}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span style={styles.successText}>{resetSuccess}</span>
                  </div>
                </div>
              )}

              {/* Error message */}
              {resetError && (
                <div style={styles.errorContainer}>
                  <div style={styles.errorContent}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span style={styles.errorText}>{resetError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleForgotPassword} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <div style={styles.inputContainer}>
                    <div 
                      style={{
                        ...styles.inputGlow,
                        opacity: focusedField === 'resetEmail' ? 0.3 : 0
                      }}
                    ></div>
                    <div style={styles.inputWrapper}>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        onFocus={() => setFocusedField('resetEmail')}
                        onBlur={() => setFocusedField(null)}
                        required
                        disabled={resetLoading}
                        placeholder="Enter your email"
                        style={{
                          ...styles.input,
                          ...(focusedField === 'resetEmail' && styles.inputFocus),
                          ...(resetLoading && styles.inputDisabled)
                        }}
                      />
                      <div style={styles.inputIcon}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    ...styles.button,
                    ...(resetLoading && styles.buttonDisabled)
                  }}
                >
                  <div style={styles.buttonGradient}></div>
                  <div style={styles.buttonContent}>
                    {resetLoading ? (
                      <>
                        <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input::placeholder {
          color: #9ca3af;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #374151;
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default Login;