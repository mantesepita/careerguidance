import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';

// --- Loading Component (Branded Splash Screen) ---
const LoadingSplash = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.logo}>
        {/* The icon element with a spin animation */}
        <div style={styles.logoIcon} className="logo-spin">
          <svg style={{ color: 'white', width: '100%', height: '100%' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Simple spark/target icon simulation */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197 2.132A1 1 0 0110 13.882V10.12a1 1 0 011.555-.832l3.197 2.132c.207.138.207.485 0 .623z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 style={styles.logoText}>ThutoPele</h1>
      </div>
      <p style={styles.loadingText}>Loading application data...</p>
      
      {/* CSS for the spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .logo-spin {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Protected Route Component ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();

  // Show branded loading screen while authentication is initializing
  if (loading) {
    return <LoadingSplash />;
  }

  // 1. Not logged in -> Redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but missing userData (e.g., initial firestore fetch failed)
  if (!userData) {
      // If user is logged in but data failed to fetch, temporarily show loading or force log out
      // For now, let's treat this as still loading/error.
      return <LoadingSplash />;
  }

  // 3. Logged in, data fetched, but role is not allowed -> Redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Allowed access
  return children;
};

// --- Main App Routes Definition ---
function AppRoutes() {
  const { currentUser, userData, loading } = useAuth();

  // Use the branded loading screen during initial load
  if (loading) {
    return <LoadingSplash />;
  }

  return (
    <>
      {/* Navigation will go here when created */}
      
      <Routes>
        {/* 🏠 Home Page */}
        <Route path="/" element={<Home />} />

        {/* 🔑 Public Auth Routes: Redirect authenticated users to their dashboard */}
        <Route
          path="/login"
          element={
            currentUser && userData?.role ? (
              <Navigate to={`/${userData.role}`} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser && userData?.role ? (
              <Navigate to={`/${userData.role}`} replace />
            ) : (
              <Register />
            )
          }
        />

        {/* 🔐 Protected Routes by Role */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/institute/*"
          element={
            <ProtectedRoute allowedRoles={['institute', 'institution']}>
              <InstituteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/*"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ⚠️ Unauthorized Page - Used for role mismatches */}
        <Route
          path="/unauthorized"
          element={
            <div style={styles.unauthorized}>
              <h1>⚠️ Unauthorized Access</h1>
              <p>You don't have permission to access this page.</p>
              <button 
                onClick={() => window.location.href = '/'}
                style={styles.button}
              >
                Go Home
              </button>
            </div>
          }
        />

        {/* ✅ Handle /undefined route (occurs if role isn't set yet) */}
        <Route
          path="/undefined"
          element={<Navigate to="/" replace />} // Redirect to home/login if role is undefined
        />

        {/* ❌ 404 Page - Catch all other routes */}
        <Route
          path="*"
          element={
            <div style={styles.notFound}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                style={styles.button}
              >
                Go Home
              </button>
            </div>
          }
        />
      </Routes>
    </>
  );
}

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

// --- Styles for feedback screens and Loading Splash ---
const styles = {
  // Styles for the branded loading screen
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fffbeb', // Light cream/yellow background
    fontFamily: 'Inter, sans-serif',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #f97316, #ec4899)', // Orange to Pink Gradient
    borderRadius: '1rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.3)',
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#333',
    letterSpacing: '-0.05em',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },

  // Styles for Unauthorized and 404 pages
  unauthorized: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#991b1b',
    backgroundColor: '#fee2e2',
    padding: '20px',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#f97316', // Primary Orange color
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.1s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  }
};

export default App;