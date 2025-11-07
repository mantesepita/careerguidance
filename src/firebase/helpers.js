import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile, // Used in updateUserProfile
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Assuming the config file is located correctly and exports auth, db, and storage
import { auth, db, storage } from './config';

// ==================== AUTH FUNCTIONS ====================

/**
 * Register a new user with email/password and create a corresponding Firestore user document.
 * @param {string} email
 * @param {string} password
 * @param {('student'|'institution'|'company'|'admin')} role
 * @param {Object} additionalData - Additional fields for the Firestore user document.
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const registerUser = async (email, password, role, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification link immediately after registration
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      emailVerified: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileCompleted: false, // Flag to check if essential profile info is set
      ...additionalData
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Login user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update last login timestamp in Firestore
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Logout the current user.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get current user data from Firestore 'users' collection.
 * @param {string} userId - The Firebase Auth user ID.
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getCurrentUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile details in both Firebase Auth and Firestore.
 * @param {string} userId - The Firebase Auth user ID.
 * @param {Object} authUpdates - Fields to update in Firebase Auth (e.g., displayName, photoURL).
 * @param {Object} firestoreUpdates - Fields to update in the Firestore 'users' document.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserProfile = async (userId, authUpdates = {}, firestoreUpdates = {}) => {
  try {
    // 1. Update Auth profile (only if auth.currentUser is not null)
    if (auth.currentUser && Object.keys(authUpdates).length > 0) {
      await updateProfile(auth.currentUser, authUpdates);
    }

    // 2. Update Firestore document
    const userDocRef = doc(db, 'users', userId);
    if (Object.keys(firestoreUpdates).length > 0) {
      await updateDoc(userDocRef, {
        ...firestoreUpdates,
        updatedAt: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sends a password reset email to the specified address.
 * @param {string} email 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// ==================== FIRESTORE CRUD ====================

/**
 * Create a new document with an auto-generated ID.
 * @param {string} collectionName - Name of the collection.
 * @param {Object} data - Data to store in the document.
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Create a new document using a specified ID.
 * @param {string} collectionName - Name of the collection.
 * @param {string} docId - Custom document ID (often the user's UID).
 * @param {Object} data - Data to store in the document.
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const createDocumentWithId = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get a single document by ID.
 * @param {string} collectionName - Name of the collection.
 * @param {string} docId - Document ID.
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      // Include the document ID in the returned data
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Document not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all documents in a collection.
 * @param {string} collectionName - Name of the collection.
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Query documents based on specified conditions, ordering, and limits.
 * @param {string} collectionName - Name of the collection.
 * @param {Array<{field: string, operator: string, value: any}>} conditions - Array of WHERE clauses.
 * @param {string} orderByField - Field to order by (optional).
 * @param {number} limitCount - Maximum number of documents to return (optional).
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const queryDocuments = async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply WHERE conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    // Apply optional ordering and limit
    if (orderByField) q = query(q, orderBy(orderByField));
    if (limitCount) q = query(q, limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update a specific document.
 * @param {string} collectionName - Name of the collection.
 * @param {string} docId - Document ID.
 * @param {Object} data - Fields and values to update.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp() // Add an update timestamp
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a specific document.
 * @param {string} collectionName - Name of the collection.
 * @param {string} docId - Document ID.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== COMMON FETCHES ====================

/**
 * Get all institutions.
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const fetchInstitutions = async () => {
  // Can be filtered later with 'where("status", "==", "approved")' if needed
  return await getAllDocuments('institutions');
};

/**
 * Get all courses.
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const fetchCourses = async () => {
  return await getAllDocuments('courses');
};

/**
 * Get all job postings.
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const fetchJobs = async () => {
  return await getAllDocuments('jobs');
};


// ==================== STORAGE ====================

/**
 * Upload a file to Firebase Storage.
 * @param {File} file - The file object to upload.
 * @param {string} path - The path/name for the file in storage (e.g., 'profiles/user_id/avatar.jpg').
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== BUSINESS LOGIC ====================

/**
 * Checks if a student is allowed to submit another application to a specific institution.
 * @param {string} studentId - ID of the student.
 * @param {string} institutionId - ID of the institution.
 * @returns {Promise<boolean>} - True if the student can apply (less than 2 applications), false otherwise.
 */
export const canStudentApply = async (studentId, institutionId) => {
  try {
    const result = await queryDocuments('applications', [
      { field: 'studentId', operator: '==', value: studentId },
      { field: 'institutionId', operator: '==', value: institutionId }
    ]);
    // Allow up to 2 applications per student per institution
    return result.data.length < 2; 
  } catch (error) {
    console.error('Error checking application limit:', error);
    return false;
  }
};

/**
 * Checks if a student meets the minimum point requirements for a course.
 * @param {string} studentId
 * @param {string} courseId
 * @returns {Promise<{eligible: boolean, reason?: string}>}
 */
export const checkCourseEligibility = async (studentId, courseId) => {
  try {
    const studentResult = await getDocument('students', studentId);
    const courseResult = await getDocument('courses', courseId);

    if (!studentResult.success) {
      return { eligible: false, reason: 'Student data not found' };
    }
    if (!courseResult.success) {
      return { eligible: false, reason: 'Course data not found' };
    }

    const student = studentResult.data;
    const course = courseResult.data;

    // Check if high school points meet the minimum course requirement
    if ((student.highSchool?.points || 0) < (course.requirements?.minimumPoints || 0)) {
      return { eligible: false, reason: 'Insufficient points' };
    }
    
    // Add more complex eligibility checks here (e.g., specific subjects, grades)

    return { eligible: true };
  } catch (error) {
    return { eligible: false, reason: error.message };
  }
};

/**
 * Calculates a match score between a student's profile and job requirements.
 * Note: This is a placeholder logic and can be made more complex.
 * @param {Object} studentData
 * @param {Object} jobRequirements
 * @returns {number} - The match score (0-100).
 */
export const calculateJobMatchScore = (studentData, jobRequirements) => {
  let score = 0;
  
  // 30 points for graduation status
  if (studentData.graduationInfo?.graduated) score += 30;
  
  // 20 points for CGPA comparison
  if ((studentData.graduationInfo?.cgpa || 0) >= (jobRequirements.minCGPA || 0)) score += 20;
  
  // Up to 30 points for matching skills
  const studentSkills = studentData.skills || [];
  const requiredSkills = jobRequirements.skills || [];
  const matchingSkills = studentSkills.filter(skill => requiredSkills.includes(skill));
  
  if (requiredSkills.length > 0) {
    const skillMatchRatio = matchingSkills.length / requiredSkills.length;
    score += Math.min(30, skillMatchRatio * 30);
  }
  
  // 20 points for work experience presence
  if (studentData.workExperience && studentData.workExperience.length > 0) score += 20;
  
  return Math.round(score);
};

/**
 * Fetches job applications for a job and filters for qualified applicants (score >= 70).
 * @param {string} jobId - ID of the job posting.
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const getQualifiedApplicants = async (jobId) => {
  try {
    const jobResult = await getDocument('jobs', jobId);
    if (!jobResult.success) return { success: false, error: 'Job not found' };

    // Fetch all applications for the specific job
    const applicationsResult = await queryDocuments('jobApplications', [
      { field: 'jobId', operator: '==', value: jobId }
    ]);
    
    // Filter applicants based on a minimum match score threshold
    const qualifiedApplicants = applicationsResult.data.filter(app => (app.matchScore || 0) >= 70);
    
    return { success: true, data: qualifiedApplicants };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Creates a new notification document.
 * @param {string} userId - Target user ID.
 * @param {string} type - Notification type (e.g., 'success', 'warning', 'info').
 * @param {string} title - Notification title.
 * @param {string} message - Notification message body.
 * @param {string|null} relatedId - ID of the related document (e.g., application ID).
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
export const createNotification = async (userId, type, title, message, relatedId = null) => {
  return await createDocument('notifications', {
    userId,
    type,
    title,
    message,
    relatedId,
    read: false, // Default to unread
  });
};

// ==================== ADMIN MODULE ====================

/**
 * Get all company documents.
 * @returns {Promise<Array<Object>>} - Array of company data or empty array on failure.
 */
export const getAllCompanies = async () => {
  try {
    const result = await getAllDocuments("companies");
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

/**
 * Update the verification/approval status of a company.
 * @param {string} companyId - ID of the company document.
 * @param {('pending'|'approved'|'rejected')} status - New status.
 * @returns {Promise<boolean>} - True on success, false on failure.
 */
export const updateCompanyStatus = async (companyId, status) => {
  try {
    const result = await updateDocument("companies", companyId, { status });
    return result.success;
  } catch (error) {
    console.error("Error updating company status:", error);
    return false;
  }
};

/**
 * Get all system reports (e.g., analytics snapshots, error logs).
 * @returns {Promise<Array<Object>>} - Array of reports or empty array on failure.
 */
export const getSystemReports = async () => {
  try {
    const result = await getAllDocuments("systemReports");
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching system reports:", error);
    return [];
  }
};

/**
 * Get system settings (single document).
 * @returns {Promise<Object>} - Settings object or empty object on failure.
 */
export const getSystemSettings = async () => {
  try {
    // Assuming system settings are stored as a single document in the collection
    const result = await getAllDocuments("systemSettings");
    return result.success && result.data.length > 0 ? result.data[0] : {};
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return {};
  }
};

/**
 * Update system settings (assumes only one settings document exists).
 * @param {Object} settings - Fields to update.
 * @returns {Promise<boolean>} - True on success, false on failure.
 */
export const updateSystemSettings = async (settings) => {
  try {
    const result = await getAllDocuments("systemSettings");
    if (result.success && result.data.length > 0) {
      // Get the ID of the existing settings document
      const docId = result.data[0].id;
      const updateResult = await updateDocument("systemSettings", docId, settings);
      return updateResult.success;
    } else {
      console.error("System settings document not found. Cannot update.");
      // Option: create new document if not found, but we'll stick to update logic here.
      return false;
    }
  } catch (error) {
    console.error("Error updating system settings:", error);
    return false;
  }
};