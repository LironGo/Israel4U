const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPostsPerMonth,
  getUserCategories,
  getGroupCategories,
  getPostsByType,
  getPostsByRegion,
  getAvgPostsPerGroup
} = require('../controllers/statsController');

// All routes are protected
router.use(protect);

router.get('/posts-per-month', getPostsPerMonth);
router.get('/user-categories', getUserCategories);
router.get('/group-categories', getGroupCategories);
router.get('/posts-by-type', getPostsByType);
router.get('/posts-by-region', getPostsByRegion);
router.get('/avg-posts-per-group', getAvgPostsPerGroup);

module.exports = router; 