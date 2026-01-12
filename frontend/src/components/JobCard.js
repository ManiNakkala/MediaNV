import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, showActions = true, onApply, onSave, onDelete, isAdmin = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.job_id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="job-type">{job.job_type || 'Full-time'}</span>
      </div>

      <p className="job-location">{job.location || 'Remote'}</p>

      <p className="job-description">
        {job.description?.length > 150
          ? `${job.description.substring(0, 150)}...`
          : job.description}
      </p>

      <div className="job-card-footer">
        <span className="job-date">Posted: {formatDate(job.created_at)}</span>
        {job.recruiter_name && (
          <span className="job-recruiter">By: {job.recruiter_name}</span>
        )}
      </div>

      {showActions && (
        <div className="job-card-actions" onClick={(e) => e.stopPropagation()}>
          {isAdmin ? (
            <>
              <button
                onClick={() => navigate(`/admin/jobs/edit/${job.job_id}`)}
                className="btn btn-edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job.job_id)}
                className="btn btn-delete"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {onApply && (
                <button onClick={() => onApply(job.job_id)} className="btn btn-apply">
                  Apply
                </button>
              )}
              {onSave && (
                <button onClick={() => onSave(job.job_id)} className="btn btn-save">
                  Save
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
