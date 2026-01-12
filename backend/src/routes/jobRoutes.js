const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob, validateJob } = require('../controllers/jobController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roleMiddleware');

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', checkAuth, checkAdmin, validateJob, createJob);
router.put('/:id', checkAuth, checkAdmin, validateJob, updateJob);
router.delete('/:id', checkAuth, checkAdmin, deleteJob);

module.exports = router;
