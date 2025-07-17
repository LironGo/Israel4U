const express = require('express');
const router = express.Router();
const { toggleLike, checkLike, getLikes } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/:postId')
    .post(toggleLike)
    .get(getLikes);

router.get('/:postId/check', checkLike);

module.exports = router; 