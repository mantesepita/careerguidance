// src/components/institute/PublishAdmissions.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments, updateDocument } from '../../firebase/helpers';

const PublishAdmissions = () => {
  const { currentUser } = useAuth();
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) fetchAdmittedStudents();
  }, [currentUser]);

  const fetchAdmittedStudents = async () => {
    const result = await queryDocuments('applications', [
      { field: 'institutionId', operator: '==', value: currentUser.uid },
      { field: 'status', operator: '==', value: 'admitted' }
    ]);
    if (result.success) {
      setAdmittedStudents(result.data);
    } else {
      setMessage(' Failed to fetch admitted students');
    }
  };

  const handlePublish = async () => {
    // mark all admitted students as "published"
    for (let student of admittedStudents) {
      await updateDocument('applications', student.id, { published: true });
    }
    setPublished(true);
    setMessage('✅ Admissions published successfully!');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎓 Publish Admissions</h1>
      {message && <div style={styles.alert}>{message}</div>}

      {admittedStudents.length === 0 ? (
        <p>No admitted students yet.</p>
      ) : (
        <>
          <p>Ready to publish admissions for {admittedStudents.length} students.</p>
          {!published ? (
            <button onClick={handlePublish} style={styles.publishButton}>
               Publish Admissions
            </button>
          ) : (
            <p style={styles.publishedText}>✅ Admissions already published</p>
          )}
          <ul>
            {admittedStudents.map((s) => (
              <li key={s.id}>{s.studentName} — {s.courseName}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  title: { color: '#2c3e50', marginBottom: '20px' },
  alert: { padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '10px' },
  publishButton: { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' },
  publishedText: { color: '#27ae60', fontWeight: 'bold' }
};

export default PublishAdmissions;
