// src/components/company/PostJob.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createDocument } from '../../firebase/helpers';

const PostJob = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const jobData = {
      ...formData,
      companyId: currentUser.uid,
      createdAt: new Date()
    };

    const result = await createDocument('jobs', jobData);
    if (result.success) {
      setMessage('✅ Job posted successfully!');
      setFormData({ title: '', description: '', requirements: '', salary: '', deadline: '' });
    } else {
      setMessage('s Failed to post job.');
    }
  };

  return (
    <div>
      <h2> Post a Job</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required />
        <textarea name="requirements" placeholder="Job Requirements" value={formData.requirements} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} />
        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
        <button type="submit"> Post Job</button>
      </form>
    </div>
  );
};

const styles = { form: { display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' } };

export default PostJob;
