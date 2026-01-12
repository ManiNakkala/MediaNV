import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './User.css';

const MyFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/favourites/my');
      setFavourites(response.data.favourites);
    } catch (err) {
      setError('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId, e) => {
    e.stopPropagation();
    if (!window.confirm('Remove this job from favourites?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/favourites/${jobId}`);
      setFavourites(favourites.filter((fav) => fav.job_id !== jobId));
    } catch (err) {
      alert('Failed to remove favourite');
    }
  };

  const handleApply = async (jobId, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post(`/applications/${jobId}`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-container">Loading saved jobs...</div>;
  }

  return (
    <div className="container user-container">
      <div className="page-header">
        <h1>Saved Jobs</h1>
        <p className="page-subtitle">Jobs you've saved for later</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {favourites.length === 0 ? (
        <div className="empty-state">
          <h3>No saved jobs</h3>
          <p>Save jobs you're interested in to find them here later</p>
          <button onClick={() => navigate('/jobs')} className="btn-browse">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="favourites-list">
          {favourites.map((fav) => (
            <div
              key={fav.favourite_id}
              className="favourite-card"
              onClick={() => navigate(`/jobs/${fav.job_id}`)}
            >
              <div className="favourite-main">
                <h3 className="favourite-title">{fav.title}</h3>
                <div className="favourite-details">
                  <span>📍 {fav.location || 'Remote'}</span>
                  <span>💼 {fav.job_type || 'Full-time'}</span>
                  {fav.recruiter_name && <span>👤 {fav.recruiter_name}</span>}
                </div>
                <p className="favourite-description">
                  {fav.description?.length > 150
                    ? `${fav.description.substring(0, 150)}...`
                    : fav.description}
                </p>
              </div>

              <div className="favourite-footer">
                <span className="favourite-date">
                  Saved on {formatDate(fav.saved_at)}
                </span>
                <div className="favourite-actions">
                  <button
                    onClick={(e) => handleApply(fav.job_id, e)}
                    className="btn btn-apply-small"
                  >
                    Apply
                  </button>
                  <button
                    onClick={(e) => handleRemove(fav.job_id, e)}
                    className="btn btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavourites;
