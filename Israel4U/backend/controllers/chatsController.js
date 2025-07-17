const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Get user conversations
// @route   GET /api/chats
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: { $in: [req.user._id] }
    })
    .populate('participants', 'fullName profilePicture')
    .populate('lastMessage')
    .sort({ lastMessageTime: -1 });

    res.json(conversations);
});

// @desc    Get conversation messages
// @route   GET /api/chats/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to view this conversation');
    }

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: { $in: conversation.participants } },
            { receiver: req.user._id, sender: { $in: conversation.participants } }
        ]
    })
    .populate('sender', 'fullName profilePicture')
    .populate('receiver', 'fullName profilePicture')
    .sort({ createdAt: 1 });

    res.json(messages);
});

// @desc    Send a message
// @route   POST /api/chats/:conversationId
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const conversationId = req.params.conversationId;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to send message in this conversation');
    }

    // Find the other participant
    const otherParticipant = conversation.participants.find(
        p => p.toString() !== req.user._id.toString()
    );

    const message = await Message.create({
        sender: req.user._id,
        receiver: otherParticipant,
        content
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'fullName profilePicture')
        .populate('receiver', 'fullName profilePicture');

    res.status(201).json(populatedMessage);
});

// @desc    Create or get conversation with user
// @route   POST /api/chats/user/:userId
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId;

    if (req.user._id.toString() === targetUserId) {
        res.status(400);
        throw new Error('Cannot create conversation with yourself');
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, targetUserId] }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, targetUserId]
        });
    }

    const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'fullName profilePicture');

    res.json(populatedConversation);
});

// @desc    Mark messages as read
// @route   PUT /api/chats/:conversationId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const conversationId = req.params.conversationId;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to access this conversation');
    }

    // Mark all unread messages as read
    await Message.updateMany(
        {
            receiver: req.user._id,
            sender: { $in: conversation.participants },
            isRead: false
        },
        { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
});

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    createConversation,
    markAsRead
}; 