import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './User.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${id}`);
      setJob(response.data.job);
    } catch (err) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await axiosInstance.post(`/applications/${id}`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post(`/favourites/${id}`);
      alert('Job saved to favourites!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Job not found</h2>
          <button onClick={() => navigate('/jobs')} className="btn-back">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn-back-small">
        ← Back
      </button>

      <div className="job-details-container">
        <div className="job-details-header">
          <div>
            <h1 className="job-details-title">{job.title}</h1>
            <div className="job-details-meta">
              <span className="meta-item">📍 {job.location || 'Remote'}</span>
              <span className="meta-item">💼 {job.job_type || 'Full-time'}</span>
              <span className="meta-item">📅 Posted {formatDate(job.created_at)}</span>
              {job.recruiter_name && (
                <span className="meta-item">👤 {job.recruiter_name}</span>
              )}
            </div>
          </div>

          <div className="job-details-actions">
            <button onClick={handleApply} className="btn btn-apply-large">
              Apply Now
            </button>
            <button onClick={handleSave} className="btn btn-save-large">
              Save Job
            </button>
          </div>
        </div>

        <div className="job-details-content">
          <h2>Job Description</h2>
          <p className="job-description-text">{job.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
