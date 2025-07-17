const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConversations, createConversation, sendMessage, getMessages, markAsRead } = require('../controllers/chatsController');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getConversations);

router.route('/user/:userId')
    .post(createConversation);

router.route('/:conversationId')
    .get(getMessages)
    .post(sendMessage);

router.put('/:conversationId/read', markAsRead);

module.exports = router; 