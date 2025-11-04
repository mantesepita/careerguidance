// src/App.js
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
// import Navigation from './components/Navigation'; // ⚠️ Uncomment when ready

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App Routes
function AppRoutes() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>🔄 Loading...</h2>
      </div>
    );
  }

  return (
    <>
      {/* ⚠️ Comment out until Navigation component is created */}
      {/* <Navigation /> */}
      
      <Routes>
        {/* 🏠 Home Page */}
        <Route path="/" element={<Home />} />

        {/* 🔑 Public Auth Routes */}
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

        {/* ⚠️ Unauthorized Page */}
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

        {/* ✅ Handle /undefined route specifically */}
        <Route
          path="/undefined"
          element={<Navigate to="/login" replace />}
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

// Styles for feedback screens
const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '24px',
    color: '#667eea',
  },
  unauthorized: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#721c24',
    backgroundColor: '#f8d7da',
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
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default App;