// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    if (!user) {
      setUserData(null);
      return null;
    }

    try {
      // Map collections to their proper role names
      const collectionsMap = {
        'admins': 'admin',
        'institutions': 'institute',
        'students': 'student',
        'companies': 'company'
      };
      
      const collections = Object.keys(collectionsMap);
      
      for (const collection of collections) {
        const userDoc = await getDoc(doc(db, collection, user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const userData = {
            ...data,
            uid: user.uid,
            email: user.email,
            role: collectionsMap[collection] // ✅ Use proper role mapping
          };
          setUserData(userData);
          return userData; // ✅ Return the user data
        }
      }

      console.error('User data not found in any collection');
      setUserData(null);
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
      return null;
    }
  };

  // Sign in
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // ✅ Fetch user data and wait for it
      const userData = await fetchUserData(result.user);
      
      // ✅ Return both success status and user data with role
      return { 
        success: true, 
        userData: userData,
        role: userData?.role 
      };
    } catch (error) {
      console.error('Login error:', error);
      // ✅ Return error in consistent format
      return { 
        success: false, 
        error: error.message || 'Failed to login' 
      };
    }
  };

  // Register
  const register = async (email, password, userData, role) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(result.user);

      // Determine collection
      let collection = '';
      switch(role) {
        case 'admin': collection = 'admins'; break;
        case 'institute':
        case 'institution': collection = 'institutions'; break;
        case 'student': collection = 'students'; break;
        case 'company': collection = 'companies'; break;
        default: throw new Error('Invalid role');
      }

      // Save Firestore document
      await setDoc(doc(db, collection, result.user.uid), {
        ...userData,
        email,
        role,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        status: role === 'company' || role === 'institution' ? 'pending' : 'active'
      });

      // Fetch user data immediately
      const fetchedUserData = await fetchUserData(result.user);

      return { 
        success: true, 
        userData: fetchedUserData,
        role: fetchedUserData?.role 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { 
    currentUser, 
    userData, 
    loading, 
    login, 
    register, 
    logout, 
    fetchUserData 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;