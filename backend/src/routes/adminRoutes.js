const express = require('express');
const router = express.Router();
const { getJobApplications } = require('../controllers/applicationController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roleMiddleware');

router.get('/jobs/:jobId/applications', checkAuth, checkAdmin, getJobApplications);

module.exports = router;
