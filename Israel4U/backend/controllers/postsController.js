const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const User = require('../models/User');
const Group = require('../models/Group');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { content, groupIds, postType, location, isEvacuee, isInjured, isReservist, isRegularSoldier } = req.body;

    // If no groups selected, post to everyone (groups: [])
    let groupsToPost = Array.isArray(groupIds) ? groupIds.filter(Boolean) : [];

    // Validate group membership for each group
    if (groupsToPost.length > 0) {
        for (const groupId of groupsToPost) {
            const group = await Group.findById(groupId);
            if (!group) {
                res.status(404);
                throw new Error('Group not found');
            }
            if (!group.members.includes(req.user._id)) {
                res.status(401);
                throw new Error('Not authorized to post in this group');
            }
        }
    }

    const postData = {
        author: req.user._id,
        content,
        postType: postType || 'general',
        location,
        isEvacuee,
        isInjured,
        isReservist,
        isRegularSoldier,
        groups: groupsToPost
    };

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id)
        .populate('author', 'fullName profilePicture')
        .populate('groups', 'name');

    res.status(201).json(populatedPost);
});

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
    const { q, category, postType, location } = req.query;
    
    let query = {};

    // Text search
    if (q) {
        query.$or = [
            { content: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
        ];
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

    // Post type filter
    if (postType) {
        query.postType = postType;
    }

    // Location filter
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    const posts = await Post.find(query)
        .populate('author', 'fullName profilePicture')
        .populate('groups', 'name')
        .sort({ createdAt: -1 });

    res.json(posts);
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'fullName profilePicture')
        .populate('group', 'name');

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error('Post not found');
    }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this post');
    }

    post.content = req.body.content || post.content;
    post.postType = req.body.postType || post.postType;
    post.location = req.body.location || post.location;
    post.isEvacuee = req.body.isEvacuee !== undefined ? req.body.isEvacuee : post.isEvacuee;
    post.isInjured = req.body.isInjured !== undefined ? req.body.isInjured : post.isInjured;
    post.isReservist = req.body.isReservist !== undefined ? req.body.isReservist : post.isReservist;
    post.isRegularSoldier = req.body.isRegularSoldier !== undefined ? req.body.isRegularSoldier : post.isRegularSoldier;

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id)
        .populate('author', 'fullName profilePicture')
        .populate('group', 'name');

    res.json(populatedPost);
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if user is the author or group manager
    if (post.author.toString() !== req.user._id.toString()) {
        if (post.group) {
            const group = await Group.findById(post.group);
            if (!group || group.manager.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('Not authorized to delete this post');
            }
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this post');
        }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post removed' });
});

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Private
const searchPosts = asyncHandler(async (req, res) => {
    const { q, category, postType, location, region } = req.query;
    
    let query = {};

    // Text search
    if (q) {
        query.$or = [
            { content: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
        ];
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

    // Post type filter
    if (postType) {
        query.postType = postType;
    }

    // Location filter
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    // Region filter (through groups)
    if (region) {
        const groupsInRegion = await Group.find({ region });
        const groupIds = groupsInRegion.map(group => group._id);
        query.groups = { $in: groupIds };
    }

    const posts = await Post.find(query)
        .populate('author', 'fullName profilePicture')
        .populate('groups', 'name')
        .sort({ createdAt: -1 });

    res.json(posts);
});

// @desc    Save/Unsave post
// @route   POST /api/posts/:id/save
// @access  Private
const toggleSavePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const isSaved = post.isSaved.includes(req.user._id);

    if (isSaved) {
        // Remove from saved
        post.isSaved = post.isSaved.filter(id => id.toString() !== req.user._id.toString());
    } else {
        // Add to saved
        post.isSaved.push(req.user._id);
    }

    await post.save();

    res.json({ 
        message: isSaved ? 'Post unsaved' : 'Post saved',
        isSaved: !isSaved
    });
});

// @desc    Pin/Unpin post (group managers only)
// @route   POST /api/posts/:id/pin
// @access  Private
const togglePinPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (!post.group) {
        res.status(400);
        throw new Error('Can only pin posts in groups');
    }

    const group = await Group.findById(post.group);
    if (!group || group.manager.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Only group managers can pin posts');
    }

    post.isPinned = !post.isPinned;

    if (post.isPinned) {
        group.pinnedPosts.push(post._id);
    } else {
        group.pinnedPosts = group.pinnedPosts.filter(id => id.toString() !== post._id.toString());
    }

    await post.save();
    await group.save();

    res.json({ 
        message: post.isPinned ? 'Post pinned' : 'Post unpinned',
        isPinned: post.isPinned
    });
});

// @desc    Get all posts saved by the current user
// @route   GET /api/posts/saved
// @access  Private
const getSavedPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ isSaved: req.user._id })
        .populate('author', 'fullName profilePicture')
        .populate('group', 'name')
        .sort({ createdAt: -1 });

    res.json(posts);
});

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
    toggleSavePost,
    togglePinPost,
    getSavedPosts
}; 