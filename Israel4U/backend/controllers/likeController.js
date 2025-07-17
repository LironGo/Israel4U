const asyncHandler = require('express-async-handler');
const Like = require('../models/Like');
const Post = require('../models/Post');

// @desc    Like/Unlike a post
// @route   POST /api/likes/:postId
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        post: postId
    });

    if (existingLike) {
        // Unlike
        await Like.findByIdAndDelete(existingLike._id);
        post.likeCount = Math.max(0, post.likeCount - 1);
        await post.save();

        res.json({ 
            message: 'Post unliked',
            liked: false,
            likeCount: post.likeCount
        });
    } else {
        // Like
        await Like.create({
            user: req.user._id,
            post: postId
        });

        post.likeCount += 1;
        await post.save();

        res.json({ 
            message: 'Post liked',
            liked: true,
            likeCount: post.likeCount
        });
    }
});

// @desc    Check if user liked a post
// @route   GET /api/likes/:postId/check
// @access  Private
const checkLike = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    const like = await Like.findOne({
        user: req.user._id,
        post: postId
    });

    res.json({ liked: !!like });
});

// @desc    Get likes for a post
// @route   GET /api/likes/:postId
// @access  Private
const getLikes = asyncHandler(async (req, res) => {
    const likes = await Like.find({ post: req.params.postId })
        .populate('user', 'fullName profilePicture');

    res.json(likes);
});

module.exports = {
    toggleLike,
    checkLike,
    getLikes
}; 