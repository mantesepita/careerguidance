// src/components/company/ViewApplicants.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { queryDocuments } from '../../firebase/helpers';

const ViewApplicants = () => {
  const { currentUser } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, [currentUser]);

  const loadApplicants = async () => {
    setLoading(true);
    const result = await queryDocuments('applications', [
      { field: 'companyId', operator: '==', value: currentUser.uid }
    ]);
    if (result.success) setApplicants(result.data);
    setLoading(false);
  };

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div>
      <h2> Qualified Applicants</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qualification</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(app => (
              <tr key={app.id}>
                <td>{app.applicantName}</td>
                <td>{app.qualification}</td>
                <td>{app.course}</td>
                <td>{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewApplicants;
