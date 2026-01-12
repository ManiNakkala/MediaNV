import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import JobCard from '../../components/JobCard';
import './Admin.css';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState({});
  const [viewingApplicants, setViewingApplicants] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/jobs');
      const userJobs = response.data.jobs.filter(
        (job) => job.created_by === JSON.parse(localStorage.getItem('user')).user_id
      );
      setJobs(userJobs);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job.job_id !== jobId));
    } catch (err) {
      alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/admin/jobs/${jobId}/applications`);
      setApplications({ ...applications, [jobId]: response.data.applications });
      setViewingApplicants(jobId);
    } catch (err) {
      alert('Failed to fetch applicants: ' + (err.response?.data?.message || err.message));
    }
  };

  const closeApplicants = () => {
    setViewingApplicants(null);
  };

  if (loading) {
    return <div className="loading-container">Loading your jobs...</div>;
  }

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <div>
          <h1>My Job Postings</h1>
          <p className="admin-subtitle">Manage your job listings and view applicants</p>
        </div>
        <button onClick={() => navigate('/admin/jobs/new')} className="btn-create-job">
          + Create New Job
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs posted yet</h3>
          <p>Create your first job posting to start receiving applications</p>
          <button onClick={() => navigate('/admin/jobs/new')} className="btn-create-job">
            Create Job Posting
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.job_id} className="admin-job-card-container">
              <JobCard job={job} showActions={false} isAdmin={true} />
              <div className="admin-job-actions">
                <button
                  onClick={() => navigate(`/admin/jobs/edit/${job.job_id}`)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => viewApplicants(job.job_id)}
                  className="btn btn-view-applicants"
                >
                  View Applicants
                </button>
                <button onClick={() => handleDelete(job.job_id)} className="btn btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingApplicants && (
        <div className="modal-overlay" onClick={closeApplicants}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Applicants</h2>
              <button onClick={closeApplicants} className="modal-close">
                ×
              </button>
            </div>

            {applications[viewingApplicants]?.length === 0 ? (
              <p className="no-applicants">No applicants yet for this job</p>
            ) : (
              <div className="applicants-list">
                {applications[viewingApplicants]?.map((applicant) => (
                  <div key={applicant.application_id} className="applicant-card">
                    <div className="applicant-info">
                      <h4>{applicant.name}</h4>
                      <p>{applicant.email}</p>
                    </div>
                    <div className="applicant-meta">
                      <span>Applied: {new Date(applicant.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
