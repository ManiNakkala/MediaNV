const pool = require('../config/db');

const addFavourite = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user_id = req.user.user_id;

    const jobExists = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);
    if (jobExists.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadySaved = await pool.query(
      'SELECT * FROM favourites WHERE user_id = $1 AND job_id = $2',
      [user_id, jobId]
    );

    if (alreadySaved.rows.length > 0) {
      return res.status(400).json({ message: 'Job already saved to favourites' });
    }

    const result = await pool.query(
      'INSERT INTO favourites (user_id, job_id) VALUES ($1, $2) RETURNING *',
      [user_id, jobId]
    );

    res.status(201).json({
      message: 'Job saved to favourites',
      favourite: result.rows[0]
    });
  } catch (error) {
    console.error('Add favourite error:', error);
    res.status(500).json({ message: 'Server error saving job to favourites' });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user_id = req.user.user_id;

    const result = await pool.query(
      'DELETE FROM favourites WHERE user_id = $1 AND job_id = $2 RETURNING *',
      [user_id, jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    res.json({ message: 'Job removed from favourites' });
  } catch (error) {
    console.error('Remove favourite error:', error);
    res.status(500).json({ message: 'Server error removing favourite' });
  }
};

const getMyFavourites = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await pool.query(
      `SELECT f.*, j.title, j.description, j.location, j.job_type, j.created_at as job_created_at, u.name as recruiter_name
       FROM favourites f
       JOIN jobs j ON f.job_id = j.job_id
       LEFT JOIN users u ON j.created_by = u.user_id
       WHERE f.user_id = $1
       ORDER BY f.saved_at DESC`,
      [user_id]
    );

    res.json({ favourites: result.rows });
  } catch (error) {
    console.error('Get my favourites error:', error);
    res.status(500).json({ message: 'Server error fetching favourites' });
  }
};

module.exports = {
  addFavourite,
  removeFavourite,
  getMyFavourites
};
