const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Get posts per month statistics
// @route   GET /api/stats/posts-per-month
// @access  Private
const getPostsPerMonth = asyncHandler(async (req, res) => {
    const { groupId } = req.query;
    
    let matchQuery = {};
    if (groupId) {
        matchQuery.group = groupId;
    }

    const stats = await Post.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format the data for D3.js
    const formattedStats = stats.map(stat => ({
        month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
        count: stat.count
    }));

    res.json(formattedStats);
});

// @desc    Get user categories statistics
// @route   GET /api/stats/user-categories
// @access  Private
const getUserCategories = asyncHandler(async (req, res) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: null,
                evacuees: { $sum: { $cond: ['$isEvacuee', 1, 0] } },
                injured: { $sum: { $cond: ['$isInjured', 1, 0] } },
                reservists: { $sum: { $cond: ['$isReservist', 1, 0] } },
                regularSoldiers: { $sum: { $cond: ['$isRegularSoldier', 1, 0] } }
            }
        }
    ]);

    if (stats.length === 0) {
        res.json({
            evacuees: 0,
            injured: 0,
            reservists: 0,
            regularSoldiers: 0
        });
    } else {
        res.json(stats[0]);
    }
});

// @desc    Get group categories statistics
// @route   GET /api/stats/group-categories
// @access  Private
const getGroupCategories = asyncHandler(async (req, res) => {
    const stats = await Group.aggregate([
        {
            $group: {
                _id: null,
                evacueeGroups: { $sum: { $cond: ['$isEvacuee', 1, 0] } },
                injuredGroups: { $sum: { $cond: ['$isInjured', 1, 0] } },
                reservistGroups: { $sum: { $cond: ['$isReservist', 1, 0] } },
                regularSoldierGroups: { $sum: { $cond: ['$isRegularSoldier', 1, 0] } }
            }
        }
    ]);

    if (stats.length === 0) {
        res.json({
            evacueeGroups: 0,
            injuredGroups: 0,
            reservistGroups: 0,
            regularSoldierGroups: 0
        });
    } else {
        res.json(stats[0]);
    }
});

// @desc    Get posts by type statistics
// @route   GET /api/stats/posts-by-type
// @access  Private
const getPostsByType = asyncHandler(async (req, res) => {
    const stats = await Post.aggregate([
        {
            $group: {
                _id: '$postType',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.json(stats);
});

// @desc    Get posts by region statistics
// @route   GET /api/stats/posts-by-region
// @access  Private
const getPostsByRegion = asyncHandler(async (req, res) => {
    const stats = await Post.aggregate([
        {
            $lookup: {
                from: 'groups',
                localField: 'group',
                foreignField: '_id',
                as: 'groupInfo'
            }
        },
        {
            $group: {
                _id: { $arrayElemAt: ['$groupInfo.region', 0] },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.json(stats);
});

// @desc    Get average posts per group
// @route   GET /api/stats/avg-posts-per-group
// @access  Private
const getAvgPostsPerGroup = asyncHandler(async (req, res) => {
    const stats = await Post.aggregate([
        { $match: { group: { $exists: true, $ne: null } } },
        {
            $group: {
                _id: '$group',
                postCount: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                averagePosts: { $avg: '$postCount' },
                totalGroups: { $sum: 1 }
            }
        }
    ]);

    if (stats.length === 0) {
        res.json({ averagePosts: 0, totalGroups: 0 });
    } else {
        res.json(stats[0]);
    }
});

module.exports = {
    getPostsPerMonth,
    getUserCategories,
    getGroupCategories,
    getPostsByType,
    getPostsByRegion,
    getAvgPostsPerGroup
}; 