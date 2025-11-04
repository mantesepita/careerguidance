const admin = require('firebase-admin');
const db = admin.firestore();

// Apply for a course
exports.applyCourse = async (req, res) => {
  try {
    const { studentId, institutionId, courseId, facultyId } = req.body;

    // Validate required fields
    if (!studentId || !institutionId || !courseId || !facultyId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get student details
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentData = studentDoc.data();

    // Check if student is already admitted to any institution
    const admittedApplications = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('status', '==', 'admitted')
      .get();

    if (!admittedApplications.empty) {
      return res.status(400).json({
        success: false,
        message: 'You are already admitted to an institution. Cannot apply to other institutions.'
      });
    }

    // Get course details
    const courseDoc = await db.collection('institutions')
      .doc(institutionId)
      .collection('faculties')
      .doc(facultyId)
      .collection('courses')
      .doc(courseId)
      .get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const courseData = courseDoc.data();

    // Check if student qualifies for the course
    const qualifies = checkQualification(studentData, courseData);
    if (!qualifies.eligible) {
      return res.status(400).json({
        success: false,
        message: qualifies.reason
      });
    }

    // Check existing applications for this institution
    const existingApplications = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('institutionId', '==', institutionId)
      .where('status', 'in', ['pending', 'admitted'])
      .get();

    // Check if already applied for this specific course
    const alreadyApplied = existingApplications.docs.some(
      doc => doc.data().courseId === courseId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this course'
      });
    }

    // Check maximum of 2 applications per institution
    if (existingApplications.size >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum of 2 course applications per institution reached'
      });
    }

    // Create application
    const applicationData = {
      studentId,
      institutionId,
      courseId,
      facultyId,
      studentName: studentData.fullName || studentData.name,
      studentEmail: studentData.email,
      courseName: courseData.name,
      facultyName: courseData.facultyName,
      institutionName: '', // Will be populated
      status: 'pending',
      applicationDate: admin.firestore.FieldValue.serverTimestamp(),
      academicRecords: studentData.academicRecords || {},
      documents: studentData.documents || [],
      qualificationMet: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Get institution name
    const institutionDoc = await db.collection('institutions').doc(institutionId).get();
    if (institutionDoc.exists) {
      applicationData.institutionName = institutionDoc.data().name;
    }

    // Save application
    const applicationRef = await db.collection('applications').add(applicationData);

    // Create notification for student
    await db.collection('notifications').add({
      userId: studentId,
      userType: 'student',
      title: 'Application Submitted',
      message: `Your application for ${courseData.name} at ${applicationData.institutionName} has been submitted successfully`,
      type: 'application',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create notification for institution
    await db.collection('notifications').add({
      userId: institutionId,
      userType: 'institution',
      title: 'New Application',
      message: `New application received from ${studentData.fullName || studentData.name} for ${courseData.name}`,
      type: 'application',
      applicationId: applicationRef.id,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: applicationRef.id,
        ...applicationData
      }
    });

  } catch (error) {
    console.error('Error applying for course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Get student applications
exports.getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const applicationsSnapshot = await db.collection('applications')
      .where('studentId', '==', studentId)
      .orderBy('applicationDate', 'desc')
      .get();

    const applications = [];
    applicationsSnapshot.forEach(doc => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Get institution applications
exports.getInstitutionApplications = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { status, facultyId, courseId } = req.query;

    if (!institutionId) {
      return res.status(400).json({
        success: false,
        message: 'Institution ID is required'
      });
    }

    let query = db.collection('applications')
      .where('institutionId', '==', institutionId);

    if (status) {
      query = query.where('status', '==', status);
    }

    if (facultyId) {
      query = query.where('facultyId', '==', facultyId);
    }

    if (courseId) {
      query = query.where('courseId', '==', courseId);
    }

    const applicationsSnapshot = await query
      .orderBy('applicationDate', 'desc')
      .get();

    const applications = [];
    applicationsSnapshot.forEach(doc => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching institution applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and status are required'
      });
    }

    const validStatuses = ['pending', 'admitted', 'rejected', 'waitlisted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get application
    const applicationDoc = await db.collection('applications').doc(applicationId).get();
    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const applicationData = applicationDoc.data();

    // If admitting, check if student is already admitted elsewhere
    if (status === 'admitted') {
      const otherAdmissions = await db.collection('applications')
        .where('studentId', '==', applicationData.studentId)
        .where('status', '==', 'admitted')
        .get();

      if (!otherAdmissions.empty) {
        return res.status(400).json({
          success: false,
          message: 'Student is already admitted to another institution'
        });
      }

      // Check if already admitted to another course in same institution
      const sameInstitutionAdmissions = await db.collection('applications')
        .where('studentId', '==', applicationData.studentId)
        .where('institutionId', '==', applicationData.institutionId)
        .where('status', '==', 'admitted')
        .get();

      if (!sameInstitutionAdmissions.empty) {
        return res.status(400).json({
          success: false,
          message: 'Student is already admitted to another course in this institution'
        });
      }
    }

    // Update application
    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (remarks) {
      updateData.remarks = remarks;
    }

    if (status === 'admitted') {
      updateData.admissionDate = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('applications').doc(applicationId).update(updateData);

    // Create notification for student
    let notificationMessage = '';
    switch (status) {
      case 'admitted':
        notificationMessage = `Congratulations! You have been admitted to ${applicationData.courseName} at ${applicationData.institutionName}`;
        break;
      case 'rejected':
        notificationMessage = `Your application for ${applicationData.courseName} at ${applicationData.institutionName} has been rejected`;
        break;
      case 'waitlisted':
        notificationMessage = `Your application for ${applicationData.courseName} at ${applicationData.institutionName} has been waitlisted`;
        break;
      default:
        notificationMessage = `Your application status has been updated to ${status}`;
    }

    await db.collection('notifications').add({
      userId: applicationData.studentId,
      userType: 'student',
      title: 'Application Status Update',
      message: notificationMessage,
      type: 'application',
      applicationId: applicationId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        applicationId,
        status,
        ...updateData
      }
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// Select institution (when admitted to multiple)
exports.selectInstitution = async (req, res) => {
  try {
    const { studentId, applicationId } = req.body;

    if (!studentId || !applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Application ID are required'
      });
    }

    // Get the selected application
    const selectedAppDoc = await db.collection('applications').doc(applicationId).get();
    if (!selectedAppDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const selectedAppData = selectedAppDoc.data();

    if (selectedAppData.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (selectedAppData.status !== 'admitted') {
      return res.status(400).json({
        success: false,
        message: 'Can only select from admitted applications'
      });
    }

    // Get all other admitted applications
    const otherAdmissions = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('status', '==', 'admitted')
      .get();

    const batch = db.batch();

    // Reject other admissions and promote waitlisted students
    for (const doc of otherAdmissions.docs) {
      if (doc.id !== applicationId) {
        // Reject this application
        batch.update(doc.ref, {
          status: 'rejected',
          remarks: 'Student selected another institution',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const rejectedAppData = doc.data();

        // Find first waitlisted student for this course
        const waitlistedSnapshot = await db.collection('applications')
          .where('institutionId', '==', rejectedAppData.institutionId)
          .where('courseId', '==', rejectedAppData.courseId)
          .where('status', '==', 'waitlisted')
          .orderBy('applicationDate', 'asc')
          .limit(1)
          .get();

        if (!waitlistedSnapshot.empty) {
          const waitlistedApp = waitlistedSnapshot.docs[0];
          batch.update(waitlistedApp.ref, {
            status: 'admitted',
            remarks: 'Promoted from waitlist',
            admissionDate: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Notify promoted student
          const promotedAppData = waitlistedApp.data();
          batch.set(db.collection('notifications').doc(), {
            userId: promotedAppData.studentId,
            userType: 'student',
            title: 'Admission Update',
            message: `Congratulations! You have been admitted to ${promotedAppData.courseName} at ${promotedAppData.institutionName} from the waiting list`,
            type: 'application',
            applicationId: waitlistedApp.id,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    }

    // Mark selected application as confirmed
    batch.update(selectedAppDoc.ref, {
      confirmed: true,
      confirmationDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    res.status(200).json({
      success: true,
      message: 'Institution selected successfully',
      data: {
        selectedApplicationId: applicationId,
        institutionName: selectedAppData.institutionName,
        courseName: selectedAppData.courseName
      }
    });

  } catch (error) {
    console.error('Error selecting institution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to select institution',
      error: error.message
    });
  }
};

// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { studentId } = req.body;

    if (!applicationId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and Student ID are required'
      });
    }

    const applicationDoc = await db.collection('applications').doc(applicationId).get();
    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const applicationData = applicationDoc.data();

    if (applicationData.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    if (applicationData.status === 'admitted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw admitted application. Please contact the institution.'
      });
    }

    await db.collection('applications').doc(applicationId).update({
      status: 'withdrawn',
      withdrawalDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application',
      error: error.message
    });
  }
};

// Helper function to check qualification
function checkQualification(studentData, courseData) {
  // Check if course has qualification requirements
  if (!courseData.qualifications || !courseData.qualifications.required) {
    return { eligible: true };
  }

  const requirements = courseData.qualifications;
  const studentAcademics = studentData.academicRecords || {};

  // Check minimum grade requirements
  if (requirements.minimumGrade && studentAcademics.overallGrade) {
    const gradeValues = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0 };
    const requiredGrade = gradeValues[requirements.minimumGrade] || 0;
    const studentGrade = gradeValues[studentAcademics.overallGrade] || 0;

    if (studentGrade < requiredGrade) {
      return {
        eligible: false,
        reason: `Minimum grade requirement not met. Required: ${requirements.minimumGrade}, You have: ${studentAcademics.overallGrade}`
      };
    }
  }

  // Check required subjects
  if (requirements.requiredSubjects && Array.isArray(requirements.requiredSubjects)) {
    const studentSubjects = studentAcademics.subjects || [];
    const missingSubjects = requirements.requiredSubjects.filter(
      reqSubject => !studentSubjects.some(
        stuSubject => stuSubject.name.toLowerCase() === reqSubject.toLowerCase()
      )
    );

    if (missingSubjects.length > 0) {
      return {
        eligible: false,
        reason: `Missing required subjects: ${missingSubjects.join(', ')}`
      };
    }
  }

  return { eligible: true };
}

module.exports = {
  applyCourse: exports.applyCourse,
  getStudentApplications: exports.getStudentApplications,
  getInstitutionApplications: exports.getInstitutionApplications,
  updateApplicationStatus: exports.updateApplicationStatus,
  selectInstitution: exports.selectInstitution,
  withdrawApplication: exports.withdrawApplication
};