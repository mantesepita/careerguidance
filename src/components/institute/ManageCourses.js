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
      requiredSubjects: '',
      minimumGrade: 'C'
    },
    description: '',
    fees: '',
    intake: '',
    availableSlots: '',
    admissionStatus: 'open'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const requiredSubjectsArray = formData.requirements.requiredSubjects
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const courseData = {
        institutionId: currentUser.uid,
        facultyId: formData.facultyId,
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        duration: formData.duration,
        level: formData.level,
        requirements: {
          minimumPoints: parseInt(formData.requirements.minimumPoints),
          requiredSubjects: requiredSubjectsArray,
          minimumGrade: formData.requirements.minimumGrade
        },
        description: formData.description,
        fees: parseFloat(formData.fees),
        intake: formData.intake,
        availableSlots: parseInt(formData.availableSlots),
        admissionStatus: formData.admissionStatus
      };

      let result;
      if (editingCourse) {
        result = await updateDocument('courses', editingCourse.id, courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? '✅ Course updated successfully!'
            : ` ${result.error}`
        });
      } else {
        result = await createDocument('courses', courseData);
        setMessage({
          type: result.success ? 'success' : 'error',
          text: result.success
            ? '✅ Course created successfully!'
            : ` ${result.error}`
        });
      }

      if (result.success) {
        resetForm();
        loadData();
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setMessage({ type: 'error', text: ' Failed to save course' });
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
        requiredSubjects: '',
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
        minimumPoints: course.requirements.minimumPoints.toString(),
        requiredSubjects: course.requirements.requiredSubjects.join(', '),
        minimumGrade: course.requirements.minimumGrade
      },
      description: course.description,
      fees: course.fees.toString(),
      intake: course.intake,
      availableSlots: course.availableSlots.toString(),
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
        ? '✅ Course deleted successfully!'
        : '❌ Failed to delete course'
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
        text: `✅ Admission ${newStatus === 'open' ? 'opened' : 'closed'} for ${course.courseName}`
      });
      loadData();
    }
  };

  // 🔄 UI Rendering
  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading courses...</h2>;
  if (faculties.length === 0)
    return (
      <div style={styles.warningCard}>
        <h2> No Faculties Found</h2>
        <p>Create a faculty first under “Manage Faculties”.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}> Manage Courses</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? ' Cancel' : ' Add Course'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
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

          <input
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="Course Name"
            required
            style={styles.input}
          />

          <input
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            required
            style={styles.input}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course Description"
            required
            style={styles.textarea}
          />

          <button type="submit" style={styles.submitButton}>
            {editingCourse ? ' Update Course' : ' Create Course'}
          </button>
        </form>
      )}

      <div style={styles.coursesGrid}>
        {courses.length === 0 ? (
          <p>No courses available. Create one above.</p>
        ) : (
          courses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <h3>{course.courseName}</h3>
              <p>{course.courseCode}</p>
              <p>{course.description}</p>
              <p>Status: {course.admissionStatus}</p>
              <div>
                <button onClick={() => toggleAdmissionStatus(course)} style={styles.smallButton}>
                  {course.admissionStatus === 'open' ? 'Close' : 'Open'}
                </button>
                <button onClick={() => handleEdit(course)} style={styles.smallButton}>Edit</button>
                <button onClick={() => handleDelete(course.id)} style={styles.smallButton}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Basic inline styles
const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#2c3e50' },
  addButton: { background: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' },
  input: { display: 'block', width: '100%', marginBottom: '10px', padding: '10px' },
  textarea: { display: 'block', width: '100%', marginBottom: '10px', padding: '10px' },
  submitButton: { background: '#2980b9', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px' },
  successAlert: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '10px' },
  errorAlert: { background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '10px' },
  coursesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  courseCard: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' },
  smallButton: { marginRight: '10px', background: '#3498db', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px' },
  warningCard: { padding: '40px', textAlign: 'center', background: '#fff3cd', borderRadius: '8px' }
};

export default ManageCourses;
