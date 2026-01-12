const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

const validateJob = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').optional().trim(),
  body('job_type').optional().trim()
];

const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, job_type } = req.body;
    const created_by = req.user.user_id;

    const result = await pool.query(
      'INSERT INTO jobs (title, description, location, job_type, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, location, job_type, created_by]
    );

    res.status(201).json({
      message: 'Job created successfully',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { search, location, job_type } = req.query;

    let query = `
      SELECT j.*, u.name as recruiter_name
      FROM jobs j
      LEFT JOIN users u ON j.created_by = u.user_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND LOWER(j.title) LIKE LOWER($${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (location) {
      query += ` AND LOWER(j.location) LIKE LOWER($${paramCount})`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (job_type) {
      query += ` AND LOWER(j.job_type) LIKE LOWER($${paramCount})`;
      params.push(`%${job_type}%`);
      paramCount++;
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);

    res.json({ jobs: result.rows });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT j.*, u.name as recruiter_name
       FROM jobs j
       LEFT JOIN users u ON j.created_by = u.user_id
       WHERE j.job_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(500).json({ message: 'Server error fetching job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, location, job_type } = req.body;

    const checkOwner = await pool.query(
      'SELECT * FROM jobs WHERE job_id = $1 AND created_by = $2',
      [id, req.user.user_id]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const result = await pool.query(
      'UPDATE jobs SET title = $1, description = $2, location = $3, job_type = $4 WHERE job_id = $5 RETURNING *',
      [title, description, location, job_type, id]
    );

    res.json({
      message: 'Job updated successfully',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const checkOwner = await pool.query(
      'SELECT * FROM jobs WHERE job_id = $1 AND created_by = $2',
      [id, req.user.user_id]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await pool.query('DELETE FROM jobs WHERE job_id = $1', [id]);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  validateJob
};
