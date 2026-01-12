import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './User.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/applications/my');
      setApplications(response.data.applications);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container">Loading your applications...</div>;
  }

  return (
    <div className="container user-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p className="page-subtitle">Track the status of your job applications</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here</p>
          <button onClick={() => navigate('/jobs')} className="btn-browse">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="application-card"
              onClick={() => navigate(`/jobs/${app.job_id}`)}
            >
              <div className="application-main">
                <h3 className="application-title">{app.title}</h3>
                <div className="application-details">
                  <span>📍 {app.location || 'Remote'}</span>
                  <span>💼 {app.job_type || 'Full-time'}</span>
                  {app.recruiter_name && <span>👤 {app.recruiter_name}</span>}
                </div>
                <p className="application-description">
                  {app.description?.length > 150
                    ? `${app.description.substring(0, 150)}...`
                    : app.description}
                </p>
              </div>

              <div className="application-footer">
                <span className="application-date">
                  Applied on {formatDate(app.applied_at)}
                </span>
                <span className="application-status">Pending</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
