const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications } = require('../controllers/applicationController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkCandidate } = require('../middleware/roleMiddleware');

router.post('/:jobId', checkAuth, checkCandidate, applyToJob);
router.get('/my', checkAuth, checkCandidate, getMyApplications);

module.exports = router;
