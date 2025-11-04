// src/components/admin/ManageInstitutions.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllDocuments, updateDocument, deleteDocument } from '../../firebase/helpers';

const ManageInstitutions = ({ refreshStats }) => {
  const { currentUser } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    const result = await getAllDocuments('institutions');
    if (result.success) setInstitutions(result.data);
    setLoading(false);
  };

  const handleApprove = async (institutionId) => {
    if (!window.confirm('Are you sure you want to approve this institution?')) return;
    const result = await updateDocument('institutions', institutionId, {
      status: 'active',
      approvedBy: currentUser.uid,
      approvedAt: new Date().toISOString()
    });
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Institution approved successfully!' });
      loadInstitutions();
      refreshStats();
    } else setMessage({ type: 'error', text: '❌ Failed to approve institution' });
  };

  const handleSuspend = async (institutionId) => {
    if (!window.confirm('Suspend this institution?')) return;
    const result = await updateDocument('institutions', institutionId, {
      status: 'suspended',
      suspendedBy: currentUser.uid,
      suspendedAt: new Date().toISOString()
    });
    if (result.success) {
      setMessage({ type: 'success', text: '⚠️ Institution suspended successfully!' });
      loadInstitutions();
      refreshStats();
    } else setMessage({ type: 'error', text: '❌ Failed to suspend institution' });
  };

  const handleReactivate = async (institutionId) => {
    if (!window.confirm('Reactivate this institution?')) return;
    const result = await updateDocument('institutions', institutionId, {
      status: 'active',
      reactivatedBy: currentUser.uid,
      reactivatedAt: new Date().toISOString()
    });
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Institution reactivated successfully!' });
      loadInstitutions();
      refreshStats();
    } else setMessage({ type: 'error', text: '❌ Failed to reactivate institution' });
  };

  const handleDelete = async (institutionId) => {
    if (!window.confirm('⚠️ This will permanently delete the institution and all related data. Proceed?')) return;
    const result = await deleteDocument('institutions', institutionId);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Institution deleted successfully!' });
      loadInstitutions();
      refreshStats();
    } else setMessage({ type: 'error', text: '❌ Failed to delete institution' });
  };

  const getFilteredInstitutions = () => {
    if (filter === 'all') return institutions;
    return institutions.filter(inst => inst.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'suspended': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading institutions...</h2>
      </div>
    );
  }

  const filteredInstitutions = getFilteredInstitutions();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏫 Manage Institutions</h1>
      <p style={styles.subtitle}>Approve, suspend, or manage educational institutions</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        {['all', 'pending', 'active', 'suspended'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.filterTab,
              ...(filter === tab ? styles.activeFilterTab : {})
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
              {tab === 'all'
                ? institutions.length
                : institutions.filter(i => i.status === tab).length}
              )
          </button>
        ))}
      </div>

      {/* Institutions List */}
      {filteredInstitutions.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏫</div>
          <h2>No Institutions Found</h2>
          <p>No institutions match the current filter.</p>
        </div>
      ) : (
        <div style={styles.institutionsList}>
          {filteredInstitutions.map(institution => (
            <div key={institution.id} style={styles.institutionCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.institutionName}>
                    {institution.name}
                    {institution.acronym && <span style={styles.acronym}> ({institution.acronym})</span>}
                  </h3>
                  <p style={styles.institutionEmail}>{institution.email}</p>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(institution.status)
                  }}
                >
                  {institution.status.toUpperCase()}
                </div>
              </div>

              <p style={styles.description}>{institution.description || 'No description available.'}</p>

              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📞 Phone:</span>
                  <span>{institution.phone || 'N/A'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📍 Address:</span>
                  <span>{institution.address || 'N/A'}</span>
                </div>
                {institution.website && (
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>🌐 Website:</span>
                    <a href={institution.website} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      Visit
                    </a>
                  </div>
                )}
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📅 Registered:</span>
                  <span>
                    {institution.createdAt?.toDate
                      ? new Date(institution.createdAt.toDate()).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div style={styles.cardActions}>
                {institution.status === 'pending' && (
                  <button onClick={() => handleApprove(institution.id)} style={{ ...styles.actionButton, backgroundColor: '#27ae60' }}>
                    ✅ Approve
                  </button>
                )}
                {institution.status === 'active' && (
                  <button onClick={() => handleSuspend(institution.id)} style={{ ...styles.actionButton, backgroundColor: '#e74c3c' }}>
                    ⚠️ Suspend
                  </button>
                )}
                {institution.status === 'suspended' && (
                  <button onClick={() => handleReactivate(institution.id)} style={{ ...styles.actionButton, backgroundColor: '#27ae60' }}>
                    ✅ Reactivate
                  </button>
                )}
                <button onClick={() => handleDelete(institution.id)} style={{ ...styles.actionButton, backgroundColor: '#95a5a6' }}>
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
  container: { maxWidth: '1200px', margin: '0 auto' },
  loadingContainer: { textAlign: 'center', padding: '50px' },
  title: { fontSize: '32px', margin: '0 0 10px', color: '#2c3e50' },
  subtitle: { fontSize: '16px', color: '#7f8c8d', marginBottom: '30px' },
  successAlert: { backgroundColor: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  errorAlert: { backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  filterTabs: { display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
  filterTab: { padding: '12px 24px', backgroundColor: 'white', border: '2px solid #e9ecef', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#2c3e50' },
  activeFilterTab: { backgroundColor: '#3498db', color: 'white', borderColor: '#3498db' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  emptyIcon: { fontSize: '80px', marginBottom: '20px' },
  institutionsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  institutionCard: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e9ecef' },
  institutionName: { margin: '0 0 8px', fontSize: '22px', color: '#2c3e50' },
  acronym: { color: '#7f8c8d', fontSize: '18px' },
  institutionEmail: { margin: 0, fontSize: '14px', color: '#7f8c8d' },
  description: { fontSize: '15px', color: '#2c3e50', marginBottom: '15px' },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' },
  detailItem: { display: 'flex', flexDirection: 'column', fontSize: '14px' },
  detailLabel: { fontWeight: '600', color: '#34495e' },
  link: { color: '#3498db', textDecoration: 'none' },
  statusBadge: { color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' },
  cardActions: { display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' },
  actionButton: { color: 'white', border: 'none', borderRadius: '6px', padding: '10px 15px', cursor: 'pointer', fontSize: '14px' }
};

export default ManageInstitutions;
