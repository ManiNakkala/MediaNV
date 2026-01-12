const pool = require('../config/db');

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user_id = req.user.user_id;

    const jobExists = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);
    if (jobExists.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadyApplied = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
      [user_id, jobId]
    );

    if (alreadyApplied.rows.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const result = await pool.query(
      'INSERT INTO applications (user_id, job_id) VALUES ($1, $2) RETURNING *',
      [user_id, jobId]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await pool.query(
      `SELECT a.*, j.title, j.description, j.location, j.job_type, j.created_at as job_created_at, u.name as recruiter_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       LEFT JOIN users u ON j.created_by = u.user_id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [user_id]
    );

    res.json({ applications: result.rows });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const jobCheck = await pool.query(
      'SELECT * FROM jobs WHERE job_id = $1 AND created_by = $2',
      [jobId, req.user.user_id]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const result = await pool.query(
      `SELECT a.*, u.name, u.email, u.created_at as user_joined_at
       FROM applications a
       JOIN users u ON a.user_id = u.user_id
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    res.json({ applications: result.rows });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications
};
