// src/firebase/helpers.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile
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
import { auth, db, storage } from './config';

// ==================== AUTH FUNCTIONS ====================

// Register a new user
export const registerUser = async (email, password, role, additionalData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await sendEmailVerification(user);
    
    await setDoc(doc(db, 'users', user.uid), {
      email,
      role,
      emailVerified: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profileCompleted: false,
      ...additionalData
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user data
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

// ==================== FIRESTORE CRUD ====================

// Create document
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

// Create document with ID
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

// Get a single document
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Document not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all documents in collection
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

// Query documents
export const queryDocuments = async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
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

// Update document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete document
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==================== STORAGE ====================

// Upload file
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

// Check student can apply
export const canStudentApply = async (studentId, institutionId) => {
  try {
    const result = await queryDocuments('applications', [
      { field: 'studentId', operator: '==', value: studentId },
      { field: 'institutionId', operator: '==', value: institutionId }
    ]);
    return result.data.length < 2;
  } catch (error) {
    console.error('Error checking application limit:', error);
    return false;
  }
};

// Check course eligibility
export const checkCourseEligibility = async (studentId, courseId) => {
  try {
    const studentResult = await getDocument('students', studentId);
    const courseResult = await getDocument('courses', courseId);
    if (!studentResult.success || !courseResult.success) {
      return { eligible: false, reason: 'Data not found' };
    }
    const student = studentResult.data;
    const course = courseResult.data;
    if (student.highSchool.points < course.requirements.minimumPoints) {
      return { eligible: false, reason: 'Insufficient points' };
    }
    return { eligible: true };
  } catch (error) {
    return { eligible: false, reason: error.message };
  }
};

// Calculate job match score
export const calculateJobMatchScore = (studentData, jobRequirements) => {
  let score = 0;
  if (studentData.graduationInfo.graduated) score += 30;
  if (studentData.graduationInfo.cgpa >= jobRequirements.minCGPA) score += 20;
  const matchingSkills = studentData.skills.filter(skill => jobRequirements.skills.includes(skill));
  score += Math.min(30, (matchingSkills.length / jobRequirements.skills.length) * 30);
  if (studentData.workExperience && studentData.workExperience.length > 0) score += 20;
  return Math.round(score);
};

// Get qualified applicants
export const getQualifiedApplicants = async (jobId) => {
  try {
    const jobResult = await getDocument('jobs', jobId);
    if (!jobResult.success) return { success: false, error: 'Job not found' };
    const job = jobResult.data;
    const applicationsResult = await queryDocuments('jobApplications', [
      { field: 'jobId', operator: '==', value: jobId }
    ]);
    const qualifiedApplicants = applicationsResult.data.filter(app => app.matchScore >= 70);
    return { success: true, data: qualifiedApplicants };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create notification
export const createNotification = async (userId, type, title, message, relatedId = null) => {
  return await createDocument('notifications', {
    userId,
    type,
    title,
    message,
    relatedId,
    read: false
  });
};

// ==================== ADMIN MODULE ====================

// Get all companies
export const getAllCompanies = async () => {
  try {
    const result = await getAllDocuments("companies");
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

// Update company status
export const updateCompanyStatus = async (companyId, status) => {
  try {
    const result = await updateDocument("companies", companyId, { status });
    return result.success;
  } catch (error) {
    console.error("Error updating company status:", error);
    return false;
  }
};

// Get system reports
export const getSystemReports = async () => {
  try {
    const result = await getAllDocuments("systemReports");
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching system reports:", error);
    return [];
  }
};

// Get system settings
export const getSystemSettings = async () => {
  try {
    const result = await getAllDocuments("systemSettings");
    return result.success && result.data.length > 0 ? result.data[0] : {};
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return {};
  }
};

// Update system settings
export const updateSystemSettings = async (settings) => {
  try {
    const result = await getAllDocuments("systemSettings");
    if (result.success && result.data.length > 0) {
      const docId = result.data[0].id;
      const updateResult = await updateDocument("systemSettings", docId, settings);
      return updateResult.success;
    } else {
      console.error("System settings document not found");
      return false;
    }
  } catch (error) {
    console.error("Error updating system settings:", error);
    return false;
  }
};
