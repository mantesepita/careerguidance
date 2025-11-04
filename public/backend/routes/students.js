const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, COLLECTIONS } = require('../config/firebase');

const router = express.Router();

// Get all institutions with courses
router.get('/institutions', async (req, res) => {
  try {
    const institutionsRef = db.collection(COLLECTIONS.INSTITUTIONS);
    const institutionsSnapshot = await institutionsRef.where('isActive', '==', true).get();
    
    const institutions = [];
    for (const doc of institutionsSnapshot.docs) {
      const institution = { id: doc.id, ...doc.data() };
      
      // Get faculties for this institution
      const facultiesRef = db.collection(COLLECTIONS.FACULTIES);
      const facultiesSnapshot = await facultiesRef
        .where('institutionId', '==', doc.id)
        .where('isActive', '==', true)
        .get();
      
      institution.faculties = [];
      for (const facultyDoc of facultiesSnapshot.docs) {
        const faculty = { id: facultyDoc.id, ...facultyDoc.data() };
        
        // Get courses for this faculty
        const coursesRef = db.collection(COLLECTIONS.COURSES);
        const coursesSnapshot = await coursesRef
          .where('facultyId', '==', facultyDoc.id)
          .where('isActive', '==', true)
          .get();
        
        faculty.courses = coursesSnapshot.docs.map(courseDoc => ({
          id: courseDoc.id,
          ...courseDoc.data()
        }));
        
        institution.faculties.push(faculty);
      }
      
      institutions.push(institution);
    }
    
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply for course
router.post('/apply', [
  body('courseId').notEmpty(),
  body('institutionId').notEmpty(),
  body('studentId').notEmpty(),
  body('documents').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, institutionId, studentId, documents } = req.body;

    // Check if student has already applied to 2 courses in this institution
    const applicationsRef = db.collection(COLLECTIONS.STUDENT_APPLICATIONS);
    const existingApplications = await applicationsRef
      .where('studentId', '==', studentId)
      .where('institutionId', '==', institutionId)
      .where('status', 'in', ['pending', 'approved'])
      .get();

    if (existingApplications.size >= 2) {
      return res.status(400).json({ 
        error: 'You can only apply to maximum 2 courses per institution' 
      });
    }

    // Check if already applied to this course
    const existingApplication = await applicationsRef
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingApplication.empty) {
      return res.status(400).json({ 
        error: 'You have already applied to this course' 
      });
    }

    // Create application
    const applicationData = {
      studentId,
      courseId,
      institutionId,
      documents,
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    const applicationRef = await applicationsRef.add(applicationData);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: applicationRef.id
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student applications
router.get('/applications/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const applicationsRef = db.collection(COLLECTIONS.STUDENT_APPLICATIONS);
    const applicationsSnapshot = await applicationsRef
      .where('studentId', '==', studentId)
      .get();

    const applications = [];
    for (const doc of applicationsSnapshot.docs) {
      const application = { id: doc.id, ...doc.data() };
      
      // Get course details
      const courseDoc = await db.collection(COLLECTIONS.COURSES).doc(application.courseId).get();
      application.course = courseDoc.exists ? courseDoc.data() : null;
      
      // Get institution details
      const institutionDoc = await db.collection(COLLECTIONS.INSTITUTIONS).doc(application.institutionId).get();
      application.institution = institutionDoc.exists ? institutionDoc.data() : null;
      
      applications.push(application);
    }
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload transcripts and certificates
router.post('/upload-documents', [
  body('studentId').notEmpty(),
  body('transcripts').isArray(),
  body('certificates').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, transcripts, certificates } = req.body;

    const studentProfileRef = db.collection(COLLECTIONS.STUDENT_PROFILES).doc(studentId);
    const studentProfile = await studentProfileRef.get();

    const profileData = {
      studentId,
      transcripts,
      certificates,
      updatedAt: new Date()
    };

    if (studentProfile.exists) {
      await studentProfileRef.update(profileData);
    } else {
      profileData.createdAt = new Date();
      await studentProfileRef.set(profileData);
    }

    res.json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobsRef = db.collection(COLLECTIONS.JOB_POSTINGS);
    const jobsSnapshot = await jobsRef
      .where('isActive', '==', true)
      .where('deadline', '>', new Date())
      .get();

    const jobs = [];
    for (const doc of jobsSnapshot.docs) {
      const job = { id: doc.id, ...doc.data() };
      
      // Get company details
      const companyDoc = await db.collection(COLLECTIONS.COMPANY_PROFILES).doc(job.companyId).get();
      job.company = companyDoc.exists ? companyDoc.data() : null;
      
      jobs.push(job);
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply for job
router.post('/apply-job', [
  body('jobId').notEmpty(),
  body('studentId').notEmpty(),
  body('coverLetter').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, studentId, coverLetter } = req.body;

    // Check if already applied
    const applicationsRef = db.collection(COLLECTIONS.JOB_APPLICATIONS);
    const existingApplication = await applicationsRef
      .where('studentId', '==', studentId)
      .where('jobId', '==', jobId)
      .get();

    if (!existingApplication.empty) {
      return res.status(400).json({ 
        error: 'You have already applied for this job' 
      });
    }

    // Create job application
    const applicationData = {
      jobId,
      studentId,
      coverLetter: coverLetter || '',
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    const applicationRef = await applicationsRef.add(applicationData);

    res.status(201).json({
      message: 'Job application submitted successfully',
      applicationId: applicationRef.id
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;