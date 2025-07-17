const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    toggleSavePost,
    togglePinPost,
    getSavedPosts
} = require('../controllers/postsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .post(createPost)
    .get(getPosts);

router.get('/search', searchPosts);
router.get('/saved', getSavedPosts);

router.route('/:id')
    .get(getPostById)
    .put(updatePost)
    .delete(deletePost);

router.post('/:id/save', toggleSavePost);
router.post('/:id/pin', togglePinPost);

module.exports = router; 