const express = require('express');
const router = express.Router();
const { getComments, createComment, updateComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(createComment);

router.route('/:postId')
    .get(getComments);

router.route('/:id')
    .put(updateComment)
    .delete(deleteComment);

module.exports = router; 