const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
    const { postId, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        author: req.user._id,
        post: postId,
        content
    });

    // Update post comment count
    post.commentCount += 1;
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'fullName profilePicture');

    res.status(201).json(populatedComment);
});

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Private
const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'fullName profilePicture')
        .sort({ createdAt: -1 });

    res.json(comments);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this comment');
    }

    comment.content = req.body.content || comment.content;
    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
        .populate('author', 'fullName profilePicture');

    res.json(populatedComment);
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this comment');
    }

    // Update post comment count
    const post = await Post.findById(comment.post);
    if (post) {
        post.commentCount = Math.max(0, post.commentCount - 1);
        await post.save();
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment removed' });
});

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
}; 