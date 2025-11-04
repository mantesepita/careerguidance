// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      // Prepare userData object
      const userData = {
        fullName: formData.fullName,
        email: formData.email
        // You can add more fields here if needed
      };

      const result = await register(
        formData.email,
        formData.password,
        userData,          // Pass the userData
        formData.role      // Pass the role
      );

      setSuccess('✅ Account created! Please check your email to verify your account.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Registration error:', err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 Career Guidance Platform</h1>
          <h2 style={styles.subtitle}>Create Your Account</h2>
        </div>

        {error && <div style={styles.error}><strong>⚠️ Error:</strong> {error}</div>}
        {success && <div style={styles.success}><strong>✅ Success!</strong> {success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>I am a:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={styles.select}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="institute">Institution</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter password (min 6 characters)"
              minLength="6"
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Confirm your password"
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '450px'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { color: '#333', marginBottom: '10px', fontSize: '28px' },
  subtitle: { color: '#666', fontSize: '18px', fontWeight: 'normal' },
  error: { backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fcc' },
  success: { backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #c3e6cb' },
  form: { display: 'flex', flexDirection: 'column' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' },
  input: { width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.3s', outline: 'none' },
  select: { width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white', cursor: 'pointer' },
  button: { width: '100%', padding: '14px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px' },
  footer: { marginTop: '25px', textAlign: 'center' },
  footerText: { color: '#666', fontSize: '14px' },
  link: { color: '#667eea', textDecoration: 'none', fontWeight: '600' }
};

export default Register;
