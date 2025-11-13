// src/components/institute/ManageCourses.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  createDocument, 
  queryDocuments, 
  updateDocument, 
  deleteDocument 
} from '../../firebase/helpers';

const ManageCourses = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    facultyId: '',
    courseName: '',
    courseCode: '',
    duration: '',
    level: 'undergraduate',
    requirements: {
      minimumPoints: '',
      requiredSubjects: [],
      minimumGrade: 'C'
    },
    description: '',
    fees: '',
    intake: '',
    availableSlots: '',
    admissionStatus: 'open'
  });

  // Available subjects (same as in StudentProfile)
  const availableSubjects = [
    'Mathematics', 'English', 'Sesotho', 'Science', 
    'Biology', 'Physics', 'Chemistry', 'Accounting',
    'Commerce', 'Economics', 'Geography', 'History',
    'Computer Studies', 'Agriculture', 'Development Studies'
  ];

  // Grade options (same as in StudentProfile)
  const gradeOptions = [
    'A*', 'A', 'B', 'C', 'D', 'E', 'F'
  ];

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);

    const facultiesResult = await queryDocuments('faculties', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (facultiesResult.success) setFaculties(facultiesResult.data);

    const coursesResult = await queryDocuments('courses', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (coursesResult.success) setCourses(coursesResult.data);

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle subject requirement changes
  const handleSubjectRequirementChange = (index, field, value) => {
    const updatedSubjects = [...formData.requirements.requiredSubjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        requiredSubjects: updatedSubjects
      }
    }));
  };

  // Add new subject requirement
  const addSubjectRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        requiredSubjects: [
          ...prev.requirements.requiredSubjects,
          { subject: '', minimumGrade: 'C' }
        ]
      }
    }));
  };

  // Remove subject requirement
  const removeSubjectRequirement = (index) => {
    const updatedSubjects = formData.requirements.requiredSubjects.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        requiredSubjects: updatedSubjects
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      // Filter out empty subject requirements
      const validRequiredSubjects = formData.requirements.requiredSubjects.filter(
        subject => subject.subject && subject.minimumGrade
      );

      const courseData = {
        institutionId: currentUser.uid,
        facultyId: formData.facultyId,
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        duration: formData.duration,
        level: formData.level,
        requirements: {
          minimumPoints: parseInt(formData.requirements.minimumPoints) || 0,
          requiredSubjects: validRequiredSubjects,
          minimumGrade: formData.requirements.minimumGrade
        },
        description: formData.description,
        fees: parseFloat(formData.fees) || 0,
        intake: formData.intake,
        availableSlots: parseInt(formData.availableSlots) || 0,
        admissionStatus: formData.admissionStatus
      };

      let result;
      if (editingCourse) {
        result = await updateDocument('courses', editingCourse.id, courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? 'Course updated successfully!'
            : ` ${result.error}`
        });
      } else {
        result = await createDocument('courses', courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? 'Course created successfully!'
            : ` ${result.error}`
        });
      }

      if (result.success) {
        resetForm();
        loadData();
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save course' });
    }
  };

  const resetForm = () => {
    setFormData({
      facultyId: '',
      courseName: '',
      courseCode: '',
      duration: '',
      level: 'undergraduate',
      requirements: {
        minimumPoints: '',
        requiredSubjects: [],
        minimumGrade: 'C'
      },
      description: '',
      fees: '',
      intake: '',
      availableSlots: '',
      admissionStatus: 'open'
    });
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      facultyId: course.facultyId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      duration: course.duration,
      level: course.level,
      requirements: {
        minimumPoints: course.requirements.minimumPoints?.toString() || '',
        requiredSubjects: course.requirements.requiredSubjects || [],
        minimumGrade: course.requirements.minimumGrade || 'C'
      },
      description: course.description,
      fees: course.fees?.toString() || '',
      intake: course.intake,
      availableSlots: course.availableSlots?.toString() || '',
      admissionStatus: course.admissionStatus
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const result = await deleteDocument('courses', courseId);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.success
        ? 'Course deleted successfully!'
        : 'Failed to delete course'
    });
    if (result.success) loadData();
  };

  const toggleAdmissionStatus = async (course) => {
    const newStatus = course.admissionStatus === 'open' ? 'closed' : 'open';
    const result = await updateDocument('courses', course.id, {
      admissionStatus: newStatus
    });
    if (result.success) {
      setMessage({
        type: 'success',
        text: `Admission ${newStatus === 'open' ? 'opened' : 'closed'} for ${course.courseName}`
      });
      loadData();
    }
  };

  // 🔄 UI Rendering
  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading courses...</h2>;
  if (faculties.length === 0)
    return (
      <div style={styles.warningCard}>
        <h2>No Faculties Found</h2>
        <p>Create a faculty first under "Manage Faculties".</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Courses</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.formTitle}>Create New Course</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Faculty</label>
            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Course Name</label>
              <input
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="Enter course name"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Course Code</label>
              <input
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="Enter course code"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Course Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course description"
              required
              style={styles.textarea}
            />
          </div>

          {/* REQUIREMENTS FIELDS */}
          <div style={styles.requirementsSection}>
            <h4 style={styles.sectionTitle}>Admission Requirements</h4>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Minimum Points Required</label>
                <input
                  type="number"
                  name="requirements.minimumPoints"
                  value={formData.requirements.minimumPoints}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Minimum Grade</label>
                <select
                  name="requirements.minimumGrade"
                  value={formData.requirements.minimumGrade}
                  onChange={handleChange}
                  style={styles.input}
                >
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Required Subjects</label>
              <div style={styles.requirementsContainer}>
                {formData.requirements.requiredSubjects.map((subjectReq, index) => (
                  <div key={index} style={styles.subjectRow}>
                    <select
                      value={subjectReq.subject}
                      onChange={(e) => handleSubjectRequirementChange(index, 'subject', e.target.value)}
                      style={styles.subjectInput}
                    >
                      <option value="">Select Subject</option>
                      {availableSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    
                    <select
                      value={subjectReq.minimumGrade}
                      onChange={(e) => handleSubjectRequirementChange(index, 'minimumGrade', e.target.value)}
                      style={styles.gradeInput}
                    >
                      {gradeOptions.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    
                    <button 
                      type="button" 
                      onClick={() => removeSubjectRequirement(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addSubjectRequirement}
                  style={styles.addSubjectButton}
                >
                  + Add Subject Requirement
                </button>
              </div>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration</label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 years"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Fees (LSL)</label>
              <input
                name="fees"
                type="number"
                value={formData.fees}
                onChange={handleChange}
                placeholder="Enter fees"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Intake Period</label>
              <input
                name="intake"
                value={formData.intake}
                onChange={handleChange}
                placeholder="e.g., January 2024"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Available Slots</label>
              <input
                name="availableSlots"
                type="number"
                value={formData.availableSlots}
                onChange={handleChange}
                placeholder="Enter slots"
                min="1"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="diploma">Diploma</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Admission Status</label>
              <select
                name="admissionStatus"
                value={formData.admissionStatus}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="open">Open for Applications</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>
        </form>
      )}

      <div style={styles.coursesGrid}>
        {courses.length === 0 ? (
          <p style={styles.noCourses}>No courses available. Create one above.</p>
        ) : (
          courses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <h3 style={styles.courseName}>{course.courseName}</h3>
              <p style={styles.courseCode}>{course.courseCode}</p>
              <p style={styles.description}>{course.description}</p>
              
              <div style={styles.requirementsPreview}>
                <strong>Requirements:</strong>
                <p>Minimum Points: {course.requirements.minimumPoints || 'Not specified'}</p>
                <p>Overall Minimum Grade: {course.requirements.minimumGrade || 'C'}</p>
                {course.requirements.requiredSubjects && course.requirements.requiredSubjects.length > 0 ? (
                  <div>
                    <strong>Required Subjects:</strong>
                    <ul style={styles.subjectList}>
                      {course.requirements.requiredSubjects.map((req, index) => (
                        <li key={index}>
                          {req.subject} (Min Grade: {req.minimumGrade})
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No specific subject requirements</p>
                )}
              </div>

              <div style={styles.courseMeta}>
                <span style={course.admissionStatus === 'open' ? styles.statusOpen : styles.statusClosed}>
                  {course.admissionStatus.toUpperCase()}
                </span>
                <span style={styles.slots}>Slots: {course.availableSlots}</span>
              </div>

              <div style={styles.actionButtons}>
                <button onClick={() => toggleAdmissionStatus(course)} style={styles.smallButton}>
                  {course.admissionStatus === 'open' ? 'Close' : 'Open'}
                </button>
                <button onClick={() => handleEdit(course)} style={styles.smallButton}>Edit</button>
                <button onClick={() => handleDelete(course.id)} style={styles.deleteButton}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Enhanced inline styles
const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #3498db'
  },
  title: { 
    color: '#2c3e50', 
    margin: 0,
    fontSize: '28px'
  },
  addButton: { 
    background: '#27ae60', 
    color: '#fff', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  form: { 
    background: '#f8f9fa', 
    padding: '25px', 
    borderRadius: '8px', 
    marginBottom: '25px',
    border: '1px solid #e0e0e0'
  },
  formTitle: {
    color: '#2c3e50',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    fontSize: '22px'
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '14px'
  },
  input: { 
    display: 'block', 
    width: '100%', 
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  textarea: { 
    display: 'block', 
    width: '100%', 
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '100px',
    fontSize: '16px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  requirementsSection: {
    background: '#fff',
    padding: '20px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#2c3e50',
    marginTop: 0,
    marginBottom: '20px',
    borderBottom: '1px solid #3498db',
    paddingBottom: '8px',
    fontSize: '18px'
  },
  requirementsContainer: {
    border: '1px solid #e0e0e0',
    padding: '15px',
    borderRadius: '4px',
    background: '#f9f9f9'
  },
  subjectRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '10px',
    background: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  },
  subjectInput: {
    flex: 2,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  gradeInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  removeButton: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  addSubjectButton: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%'
  },
  submitButton: { 
    background: '#2980b9', 
    color: '#fff', 
    border: 'none', 
    padding: '15px 30px', 
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  successAlert: { 
    background: '#d4edda', 
    color: '#155724', 
    padding: '15px', 
    borderRadius: '5px', 
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
    fontSize: '16px'
  },
  errorAlert: { 
    background: '#f8d7da', 
    color: '#721c24', 
    padding: '15px', 
    borderRadius: '5px', 
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
    fontSize: '16px'
  },
  coursesGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '25px' 
  },
  courseCard: { 
    border: '1px solid #ddd', 
    padding: '20px', 
    borderRadius: '8px', 
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  courseName: { 
    color: '#2c3e50', 
    margin: '0 0 10px 0',
    fontSize: '20px'
  },
  courseCode: {
    color: '#7f8c8d',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  description: {
    color: '#34495e',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
    fontSize: '14px'
  },
  requirementsPreview: {
    background: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  subjectList: {
    margin: '8px 0',
    paddingLeft: '20px',
    fontSize: '13px'
  },
  courseMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  statusOpen: {
    background: '#27ae60',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  statusClosed: {
    background: '#e74c3c',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  slots: {
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px'
  },
  smallButton: { 
    flex: 1,
    background: '#3498db', 
    color: '#fff', 
    border: 'none', 
    padding: '10px 15px', 
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  deleteButton: {
    flex: 1,
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  noCourses: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '18px',
    gridColumn: '1 / -1',
    padding: '40px'
  },
  warningCard: { 
    padding: '40px', 
    textAlign: 'center', 
    background: '#fff3cd', 
    borderRadius: '8px',
    border: '1px solid #ffeaa7',
    color: '#856404'
  }
};

export default ManageCourses;