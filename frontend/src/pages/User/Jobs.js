import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import JobCard from '../../components/JobCard';
import './User.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.job_type) params.append('job_type', filters.job_type);

      const response = await axiosInstance.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post(`/applications/${jobId}`);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleSave = async (jobId) => {
    try {
      await axiosInstance.post(`/favourites/${jobId}`);
      alert('Job saved to favourites!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading jobs...</div>;
  }

  return (
    <div className="container user-container">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p className="page-subtitle">Find your dream job from our listings</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by job title..."
            className="search-input"
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location..."
            className="search-input"
          />
          <select
            name="job_type"
            value={filters.job_type}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <button type="submit" className="btn-search">
            Search
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              showActions={true}
              onApply={handleApply}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
