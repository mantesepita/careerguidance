// src/components/institute/ViewApplications.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments, updateDocument } from '../../firebase/helpers';

const ViewApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) loadApplications();
  }, [currentUser]);

  const loadApplications = async () => {
    setLoading(true);
    const result = await queryDocuments('applications', [
      { field: 'institutionId', operator: '==', value: currentUser.uid }
    ]);
    if (result.success) {
      setApplications(result.data);
    } else {
      setMessage(' Failed to load applications');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateDocument('applications', id, { status: newStatus });
    if (result.success) {
      setMessage(`✅ Application ${newStatus} successfully`);
      loadApplications();
    } else {
      setMessage(' Failed to update status');
    }
  };

  if (loading) return <h3 style={styles.loading}>Loading applications...</h3>;

  if (applications.length === 0)
    return <p style={styles.info}>No student applications found.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> Student Applications</h1>
      {message && <div style={styles.alert}>{message}</div>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.studentName}</td>
              <td>{app.courseName}</td>
              <td>{app.status}</td>
              <td>
                <button
                  onClick={() => handleStatusChange(app.id, 'admitted')}
                  style={{ ...styles.button, backgroundColor: '#27ae60' }}
                >
                  ✅ Admit
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  style={{ ...styles.button, backgroundColor: '#e74c3c' }}
                >
                   Reject
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'pending')}
                  style={{ ...styles.button, backgroundColor: '#f1c40f' }}
                >
                   Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  title: { color: '#2c3e50', marginBottom: '20px' },
  alert: { padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '10px', borderRadius: '5px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  button: { color: '#fff', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px', cursor: 'pointer' },
  loading: { textAlign: 'center', marginTop: '40px' },
  info: { textAlign: 'center', marginTop: '40px', color: '#7f8c8d' },
};

export default ViewApplications;
