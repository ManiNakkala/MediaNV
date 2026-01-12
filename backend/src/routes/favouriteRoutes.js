const express = require('express');
const router = express.Router();
const { addFavourite, removeFavourite, getMyFavourites } = require('../controllers/favouriteController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkCandidate } = require('../middleware/roleMiddleware');

router.post('/:jobId', checkAuth, checkCandidate, addFavourite);
router.delete('/:jobId', checkAuth, checkCandidate, removeFavourite);
router.get('/my', checkAuth, checkCandidate, getMyFavourites);

module.exports = router;
