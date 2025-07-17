const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid user ID');
    }
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('groups', 'name city region')
        .populate('managedGroups', 'name city region');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.fullName = req.body.fullName || user.fullName;
        user.phone = req.body.phone || user.phone;
        user.region = req.body.region || user.region;
        user.city = req.body.city || user.city;
        user.isEvacuee = req.body.isEvacuee !== undefined ? req.body.isEvacuee : user.isEvacuee;
        user.isInjured = req.body.isInjured !== undefined ? req.body.isInjured : user.isInjured;
        user.isReservist = req.body.isReservist !== undefined ? req.body.isReservist : user.isReservist;
        user.isRegularSoldier = req.body.isRegularSoldier !== undefined ? req.body.isRegularSoldier : user.isRegularSoldier;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            region: updatedUser.region,
            city: updatedUser.city,
            isEvacuee: updatedUser.isEvacuee,
            isInjured: updatedUser.isInjured,
            isReservist: updatedUser.isReservist,
            isRegularSoldier: updatedUser.isRegularSoldier,
            isGroupManager: updatedUser.isGroupManager
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
    const { q, region, city, category } = req.query;
    
    let query = {};

    // Text search
    if (q && q.trim() !== '') {
        query.$or = [
            { fullName: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
        ];
    }

    // Region filter
    if (region) {
        query.region = region;
    }

    // City filter
    if (city) {
        query.city = { $regex: city, $options: 'i' };
    }

    // Category filters
    if (category) {
        const categories = category.split(',');
        const categoryQuery = {};
        
        categories.forEach(cat => {
            switch (cat) {
                case 'evacuee':
                    categoryQuery.isEvacuee = true;
                    break;
                case 'injured':
                    categoryQuery.isInjured = true;
                    break;
                case 'reservist':
                    categoryQuery.isReservist = true;
                    break;
                case 'regularSoldier':
                    categoryQuery.isRegularSoldier = true;
                    break;
            }
        });
        
        if (Object.keys(categoryQuery).length > 0) {
            query.$or = Object.keys(categoryQuery).map(key => ({ [key]: categoryQuery[key] }));
        }
    }

    // Exclude current user (defensive check)
    if (req.user && mongoose.Types.ObjectId.isValid(req.user._id)) {
        query._id = { $ne: req.user._id };
    }

    const users = await User.find(query)
        .select('-password')
        .limit(20);

    res.json(users);
});

// @desc    Add friend
// @route   POST /api/users/friends/:id
// @access  Private
const addFriend = asyncHandler(async (req, res) => {
    const friendId = req.params.id;
    
    if (req.user._id.toString() === friendId) {
        res.status(400);
        throw new Error('Cannot add yourself as friend');
    }

    const friend = await User.findById(friendId);
    if (!friend) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if already friends
    if (req.user.friends.includes(friendId)) {
        res.status(400);
        throw new Error('Already friends');
    }

    // Add to friends list
    req.user.friends.push(friendId);
    friend.friends.push(req.user._id);

    await req.user.save();
    await friend.save();

    res.json({ message: 'Friend added successfully' });
});

// @desc    Remove friend
// @route   DELETE /api/users/friends/:id
// @access  Private
const removeFriend = asyncHandler(async (req, res) => {
    const friendId = req.params.id;

    // Remove from friends list
    req.user.friends = req.user.friends.filter(id => id.toString() !== friendId);
    await req.user.save();

    // Remove from friend's friends list
    const friend = await User.findById(friendId);
    if (friend) {
        friend.friends = friend.friends.filter(id => id.toString() !== req.user._id.toString());
        await friend.save();
    }

    res.json({ message: 'Friend removed successfully' });
});

// @desc    Get user's posts
// @route   GET /api/users/:id/posts
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: req.params.id })
        .populate('author', 'fullName profilePicture')
        .populate('group', 'name')
        .sort({ createdAt: -1 });

    res.json(posts);
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    searchUsers,
    addFriend,
    removeFriend,
    getUserPosts
}; 