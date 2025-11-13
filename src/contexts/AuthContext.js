import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

/**
 * Custom hook to consume the AuthContext.
 * @returns {object} The authentication context value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/**
 * Provides authentication state and methods to the app.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase Auth user object
  const [userData, setUserData] = useState(null);     // Firestore user data + role
  const [loading, setLoading] = useState(true);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  // Map collections to their proper role names
  const collectionsMap = {
    'admins': 'admin',
    'institutions': 'institute',
    'students': 'student',
    'companies': 'company'
  };

  // Rate limiting for login attempts
  const loginAttempts = new Map();

  const checkRateLimit = (email) => {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0, blockUntil: 0 };
    
    // Check if still in block period
    if (now < attempts.blockUntil) {
      const minutesLeft = Math.ceil((attempts.blockUntil - now) / (1000 * 60));
      return {
        allowed: false,
        message: `Too many failed attempts. Please try again in ${minutesLeft} minute(s).`
      };
    }
    
    // Reset counter if more than 15 minutes have passed since last attempt
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      attempts.count = 0;
    }
    
    // Block for 15 minutes after 5 failed attempts
    if (attempts.count >= 5) {
      attempts.blockUntil = now + (15 * 60 * 1000); // 15 minutes block
      loginAttempts.set(email, attempts);
      return {
        allowed: false,
        message: "Too many failed attempts. Please try again in 15 minutes."
      };
    }
    
    return { allowed: true };
  };

  const updateRateLimit = (email, success) => {
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0, blockUntil: 0 };
    
    if (success) {
      // Reset on successful login
      attempts.count = 0;
      attempts.blockUntil = 0;
    } else {
      // Increment on failed attempt
      attempts.count++;
      attempts.lastAttempt = Date.now();
    }
    
    loginAttempts.set(email, attempts);
  };

  /**
   * Fetch user data from the appropriate Firestore collection based on UID.
   * This is the critical step for assigning the user's role.
   * @param {object} user - The Firebase Auth user object.
   * @returns {object|null} The merged user data with role, or null if not found.
   */
  const fetchUserData = async (user) => {
    if (!user) {
      setUserData(null);
      return null;
    }

    try {
      const collections = Object.keys(collectionsMap);
      
      for (const collectionName of collections) {
        const userDoc = await getDoc(doc(db, collectionName, user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const role = collectionsMap[collectionName];
          const userData = {
            ...data,
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified, // Include email verification status
            role: role // Use proper role mapping
          };
          setUserData(userData);
          return userData; // Return the user data
        }
      }

      console.error(`User data not found for UID: ${user.uid} in any collection`);
      setUserData(null);
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
      return null;
    }
  };

  /**
   * Signs in a user with email and password.
   * @param {string} email 
   * @param {string} password 
   * @returns {object} Success/error status and user data/role.
   */
  const login = async (email, password) => {
    try {
      // Input validation
      if (!email || !password) {
        return { 
          success: false, 
          error: "Email and password are required." 
        };
      }

      // Check rate limiting
      const rateLimitCheck = checkRateLimit(email);
      if (!rateLimitCheck.allowed) {
        return { 
          success: false, 
          error: rateLimitCheck.message 
        };
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // CRITICAL: Check email verification before allowing login
      if (!result.user.emailVerified) {
        await signOut(auth);
        updateRateLimit(email, false);
        return { 
          success: false, 
          error: "Please verify your email address before logging in. Check your inbox for the verification link." 
        };
      }
      
      // Fetch user data and wait for it
      const userData = await fetchUserData(result.user);
      
      if (!userData) {
        // Log out the user if Firestore data is missing despite successful authentication
        await signOut(auth);
        updateRateLimit(email, false);
        return { 
          success: false, 
          error: "Your user data could not be found. Please contact support." 
        };
      }

      // Reset rate limit on successful login
      updateRateLimit(email, true);

      // Return both success status and user data with role
      return { 
        success: true, 
        userData: userData,
        role: userData?.role 
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Update rate limit for failed attempt
      updateRateLimit(email, false);
      
      // Return error in consistent format
      let errorMessage = 'Failed to login. Please try again.';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect email or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to login.';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  /**
   * Registers a new user and saves their profile data to Firestore.
   * @param {string} email 
   * @param {string} password 
   * @param {object} profileData - Extra data to store in Firestore (e.g., name, phone).
   * @param {string} role - The intended role ('admin', 'institute', 'student', 'company').
   * @returns {object} Success/error status and user data/role.
   */
  const register = async (email, password, profileData, role) => {
    try {
      // Input validation
      if (!email || !password || !profileData || !role) {
        return { success: false, error: "All fields are required." };
      }

      // Enhanced email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: "Please enter a valid email address." };
      }

      // Additional email validation checks
      if (email.length > 254) { // RFC 5321 limit
        return { success: false, error: "Email address is too long." };
      }

      const parts = email.split('@');
      if (parts[0].length > 64) { // Local part limit
        return { success: false, error: "Invalid email address format." };
      }

      const domain = parts[1];
      const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain)) {
        return { success: false, error: "Please enter a valid email domain." };
      }

      // Check for common fake email patterns
      const fakeEmailPatterns = [
        /^test@/i,
        /^fake@/i,
        /^demo@/i,
        /^temp@/i,
        /@example\./i,
        /@test\./i,
        /@fake\./i,
        /@temp\./i,
        /123@/,
        /admin@/i
      ];

      for (const pattern of fakeEmailPatterns) {
        if (pattern.test(email)) {
          return { success: false, error: "Please use a valid personal or work email address." };
        }
      }

      // Validate role
      const validRoles = ['admin', 'institute', 'student', 'company'];
      if (!validRoles.includes(role)) {
        return { success: false, error: "Invalid user role specified." };
      }

      // Validate profile data (basic check)
      if (typeof profileData !== 'object' || Object.keys(profileData).length === 0) {
        return { success: false, error: "Profile data is required." };
      }

      // Set flag to indicate new registration
      setIsNewRegistration(true);

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Send verification email
      await sendEmailVerification(user);

      // Determine collection name
      let collectionName = '';
      switch(role) {
        case 'admin': collectionName = 'admins'; break;
        case 'institute':
        case 'institution': collectionName = 'institutions'; break;
        case 'student': collectionName = 'students'; break;
        case 'company': collectionName = 'companies'; break;
        default: throw new Error('Invalid role specified for registration.');
      }

      // Initial status is 'pending' for Institutions/Companies, 'active' for Students/Admins
      const initialStatus = (role === 'company' || role === 'institute') ? 'pending' : 'active';

      // Enhanced Firestore document with additional security fields
      const firestoreData = {
        ...profileData,
        email,
        role,
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        status: initialStatus,
        lastLogin: null,
        loginCount: 0,
        lastUpdated: new Date().toISOString()
      };
      
      await setDoc(doc(db, collectionName, user.uid), firestoreData);

      // IMPORTANT: Sign out the user immediately after registration
      await signOut(auth);

      return { 
        success: true, 
        message: "Registration successful! Please check your email for the verification link. You must verify your email before logging in."
      };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to create account.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Sends a password reset email to the specified email address.
   * @param {string} email 
   * @returns {object} Success/error status.
   */
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          errorMessage = 'No account found with this email address or invalid email.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Signs out the current user.
   */
  const logout = async () => {
    try {
      await signOut(auth);
      // State will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  /**
   * Resends email verification to the current user.
   * @returns {object} Success/error status.
   */
  const resendVerificationEmail = async () => {
    try {
      if (!currentUser) {
        return { success: false, error: "No user is currently logged in." };
      }
      
      if (currentUser.emailVerified) {
        return { success: false, error: "Email is already verified." };
      }
      
      await sendEmailVerification(currentUser);
      return { 
        success: true, 
        message: "Verification email sent successfully. Please check your inbox." 
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { 
        success: false, 
        error: "Failed to send verification email. Please try again." 
      };
    }
  };

  /**
   * Updates user profile data in Firestore.
   * @param {object} updates - The fields to update.
   * @returns {object} Success/error status.
   */
  const updateUserData = async (updates) => {
    try {
      if (!currentUser || !userData || !userData.role) {
        throw new Error('No authenticated user or role data available.');
      }

      // Determine collection based on role
      const collectionName = Object.keys(collectionsMap).find(key => collectionsMap[key] === userData.role);
      
      if (!collectionName) {
        throw new Error('Invalid user role for update.');
      }

      // Update Firestore document using the current user's UID and role-specific collection
      await setDoc(doc(db, collectionName, currentUser.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      }, { merge: true }); // Use merge: true to only update specified fields

      // Refresh user data state
      await fetchUserData(currentUser);
      return { success: true };
    } catch (error) {
      console.error('Update user data error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Checks the email verification status.
   * @returns {boolean} True if email is verified.
   */
  const checkEmailVerified = () => {
    // Rely on the currentUser object which is updated by onAuthStateChanged
    return currentUser?.emailVerified || false;
  };

  /**
   * Reloads the Firebase Auth user object and refreshes Firestore data.
   * Useful after sending verification email and checking if user has verified it.
   */
  const reloadUser = async () => {
    if (currentUser) {
      // Force a token refresh to get the latest email verification status
      await currentUser.reload();
      // Update state with reloaded user object
      setCurrentUser(auth.currentUser); 
      // Fetch the latest firestore data as well
      await fetchUserData(auth.currentUser);
    }
  };

  // Auth state listener - central hub for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If this is a new registration, don't automatically set the user
      if (isNewRegistration) {
        setIsNewRegistration(false);
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, [isNewRegistration]); // Run when isNewRegistration changes

  // Context value object
  const value = { 
    currentUser, 
    userData, 
    loading, 
    login, 
    register, 
    logout, 
    resetPassword,
    updateUserData,
    checkEmailVerified,
    reloadUser,
    fetchUserData,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;