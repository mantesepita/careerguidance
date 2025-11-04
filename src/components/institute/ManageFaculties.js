// src/components/institute/ManageFaculties.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  createDocument, 
  queryDocuments, 
  updateDocument, 
  deleteDocument 
} from '../../firebase/helpers';

const ManageFaculties = () => {
  const { currentUser } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dean: '',
    email: ''
  });

  useEffect(() => {
    loadFaculties();
  }, [currentUser]);

  const loadFaculties = async () => {
    setLoading(true);
    const result = await queryDocuments('faculties', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);

    if (result.success) {
      setFaculties(result.data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const facultyData = {
        ...formData,
        institutionId: currentUser.uid
      };

      let result;
      if (editingFaculty) {
        // Update existing faculty
        result = await updateDocument('faculties', editingFaculty.id, facultyData);
        if (result.success) {
          setMessage({ type: 'success', text: '✅ Faculty updated successfully!' });
        }
      } else {
        // Create new faculty
        result = await createDocument('faculties', facultyData);
        if (result.success) {
          setMessage({ type: 'success', text: '✅ Faculty created successfully!' });
        }
      }

      if (result.success) {
        setFormData({ name: '', description: '', dean: '', email: '' });
        setShowForm(false);
        setEditingFaculty(null);
        loadFaculties();
      } else {
        setMessage({ type: 'error', text: ` ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save faculty' });
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      description: faculty.description,
      dean: faculty.dean,
      email: faculty.email
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm('Are you sure you want to delete this faculty? This action cannot be undone.')) {
      return;
    }

    const result = await deleteDocument('faculties', facultyId);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Faculty deleted successfully!' });
      loadFaculties();
    } else {
      setMessage({ type: 'error', text: ' Failed to delete faculty' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFaculty(null);
    setFormData({ name: '', description: '', dean: '', email: '' });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading faculties...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}> Manage Faculties</h1>
          <p style={styles.subtitle}>Create and manage your institution's faculties</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? ' Cancel' : 'Add Faculty'}
        </button>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingFaculty ? ' Edit Faculty' : ' Add New Faculty'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Faculty Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g., Faculty of Information & Communication Technology"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Brief description of the faculty"
                rows="3"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dean/Head of Faculty *</label>
                <input
                  type="text"
                  name="dean"
                  value={formData.dean}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Dr. John Doe"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Faculty Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="faculty@institution.ls"
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitButton}>
                {editingFaculty ? '💾 Update Faculty' : '➕ Create Faculty'}
              </button>
              <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Faculties List */}
      {faculties.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📚</div>
          <h2>No Faculties Yet</h2>
          <p>Create your first faculty to start organizing your courses.</p>
        </div>
      ) : (
        <div style={styles.facultiesGrid}>
          {faculties.map(faculty => (
            <div key={faculty.id} style={styles.facultyCard}>
              <div style={styles.facultyHeader}>
                <h3 style={styles.facultyName}>{faculty.name}</h3>
              </div>

              <p style={styles.facultyDescription}>{faculty.description}</p>

              <div style={styles.facultyDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailIcon}>👤</span>
                  <span><strong>Dean:</strong> {faculty.dean}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailIcon}>📧</span>
                  <span>{faculty.email}</span>
                </div>
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => handleEdit(faculty)}
                  style={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(faculty.id)}
                  style={styles.deleteButton}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: 0
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  successAlert: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  formTitle: {
    fontSize: '24px',
    marginBottom: '25px',
    color: '#2c3e50'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px'
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  facultiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  facultyCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  facultyHeader: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e9ecef'
  },
  facultyName: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50'
  },
  facultyDescription: {
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  facultyDetails: {
    marginBottom: '20px'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#555'
  },
  detailIcon: {
    marginRight: '10px',
    fontSize: '18px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default ManageFaculties;