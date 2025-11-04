// src/components/company/SendInvitations.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createDocument } from '../../firebase/helpers';

const SendInvitations = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    applicantEmail: '',
    message: '',
    date: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const invitationData = {
      companyId: currentUser.uid,
      applicantEmail: formData.applicantEmail,
      message: formData.message,
      interviewDate: formData.date,
      sentAt: new Date()
    };

    const result = await createDocument('invitations', invitationData);
    if (result.success) {
      setStatus('✅ Invitation sent successfully!');
      setFormData({ applicantEmail: '', message: '', date: '' });
    } else {
      setStatus('❌ Failed to send invitation.');
    }
  };

  return (
    <div>
      <h2> Send Interview Invitation</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="email" name="applicantEmail" placeholder="Applicant Email" value={formData.applicantEmail} onChange={handleChange} required />
        <textarea name="message" placeholder="Invitation Message" value={formData.message} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <button type="submit">Send Invitation</button>
      </form>
    </div>
  );
};

const styles = { form: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' } };

export default SendInvitations;
