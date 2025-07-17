const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    searchUsers,
    addFriend,
    removeFriend,
    getUserPosts
} = require('../controllers/usersController');
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Search users
router.get('/search', protect, searchUsers);
// Get current user (with friends)
router.get('/me', protect, getMe);
// Update user profile
router.put('/profile', protect, updateUserProfile);
// Delete user profile
router.delete('/profile', protect, deleteUserProfile);
// Add friend
router.post('/friends/:id', protect, addFriend);
// Remove friend
router.delete('/friends/:id', protect, removeFriend);
// Get user's posts
router.get('/:id/posts', protect, getUserPosts);
// Get user profile
router.get('/:id', protect, getUserProfile);

module.exports = router; 