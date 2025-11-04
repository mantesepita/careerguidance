import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      config.headers.Authorization = `Bearer ${user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: (token) => api.get(`/auth/verify/${token}`),
};

// Student API
export const studentAPI = {
  getInstitutions: () => api.get('/student/institutions'),
  applyForCourse: (data) => api.post('/student/apply', data),
  getApplications: (studentId) => api.get(`/student/applications/${studentId}`),
  uploadDocuments: (data) => api.post('/student/upload-documents', data),
  getJobs: () => api.get('/student/jobs'),
  applyForJob: (data) => api.post('/student/apply-job', data),
};

// Institute API
export const instituteAPI = {
  getApplications: (instituteId) => api.get(`/institute/applications/${instituteId}`),
  updateApplication: (data) => api.put('/institute/application', data),
  addCourse: (data) => api.post('/institute/course', data),
  getCourses: (instituteId) => api.get(`/institute/courses/${instituteId}`),
};

// Company API
export const companyAPI = {
  postJob: (data) => api.post('/company/job', data),
  getJobs: (companyId) => api.get(`/company/jobs/${companyId}`),
  getApplicants: (jobId) => api.get(`/company/applicants/${jobId}`),
  updateJobApplication: (data) => api.put('/company/application', data),
};

// Admin API
export const adminAPI = {
  getInstitutions: () => api.get('/admin/institutions'),
  addInstitution: (data) => api.post('/admin/institution', data),
  getCompanies: () => api.get('/admin/companies'),
  manageCompany: (data) => api.put('/admin/company', data),
  getReports: () => api.get('/admin/reports'),
};

export default api;