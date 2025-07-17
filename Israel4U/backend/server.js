const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const config = require('./config/config');

// Import models
const User = require('./models/User');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

// Import middleware and routes
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');
const chatsRoutes = require('./routes/chats');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// CORS Configuration
// const frontendUrl = config.FRONTEND_URL;
// const allowedOrigins = [
//     frontendUrl,
//     'http://localhost:3000',
//     'http://localhost:3001'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             const error = new Error(`CORS Error: Not allowed by CORS: ${origin}`);
//             console.error(error.message);
//             callback(error, false);
//         }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
// CORS Setup
app.use(cors({
  origin: true, // Allow all origins for local development
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Logger
app.use((req, res, next) => {
    console.log(`[HTTP Request] ${new Date().toISOString()} ${req.method} ${req.originalUrl} - from origin: ${req.headers.origin || 'N/A'}`);
    next();
});

// MongoDB Connection
const mongoUri = config.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('[MongoDB] Connected to MongoDB successfully'))
    .catch(err => console.error('[MongoDB] Could not connect to MongoDB:', err));

// HTTP API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.IO Setup
const io = new Server(server, {
    cors: { origin: true, credentials: true },
    pingInterval: 10000,
    pingTimeout: 5000,
});

app.set('io', io);

// Socket.IO JWT Authentication Middleware
io.use(async (socket, next) => {
    console.log(`[Socket Auth Middleware] ${new Date().toISOString()} - Socket ID: ${socket.id} - Attempting authentication.`);
    const token = socket.handshake.auth.token;
    console.log(`[Socket Auth Middleware] Token received: ${token ? 'YES' : 'NO'}`);
    
    if (!token) {
        console.error('Socket Auth Error: Token not provided in handshake.');
        return next(new Error('Authentication error: Token not provided.'));
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        if (!decoded.userId) {
            console.error(`[Socket Auth Middleware] Auth Error: userId missing in JWT payload for socket ID: ${socket.id}. Decoded:`, decoded);
            return next(new Error('Authentication error: Invalid token payload. userId missing.'));
        }
        
        socket.user = {
            userId: decoded.userId,
            username: decoded.username
        };
        
        console.log(`[Socket Auth Middleware] User ${socket.user.userId} authenticated successfully for socket ID: ${socket.id}.`);
        next();
    } catch (err) {
        console.error(`[Socket Auth Middleware] Auth Error: Invalid token for socket ID: ${socket.id}: ${err.message}`);
        return next(new Error('Authentication error: Invalid token.'));
    }
});

// Socket.IO Event Handlers
io.on('connection', socket => {
    console.log(`[Socket.IO Connection] ${new Date().toISOString()} - User connected: Socket ID: ${socket.id}, Auth User ID: ${socket.user.userId}`);
    
    socket.on('error', (err) => {
        console.error(`[Socket.IO Error] Socket ID: ${socket.id}, User ID: ${socket.user.userId || 'N/A'} - Error: ${err.message}`, err);
    });

    socket.on('join_chat_room', async (chatId) => {
        console.log(`[Socket.IO Event] ${new Date().toISOString()} - User ${socket.user.userId} attempting to join chat room: ${chatId}`);
        try {
            const conversation = await Conversation.findById(chatId)
                .populate({
                    path: 'participants',
                    model: 'User',
                    select: 'user_id'
                });

            if (!conversation) {
                console.warn(`[Socket.IO Event] Chat room ${chatId} not found for user ${socket.user.userId}.`);
                return;
            }

            const isParticipant = conversation.participants.some(
                p => String(p._id) === String(socket.user.userId)
            );

            if (isParticipant) {
                socket.join(chatId);
                console.log(`[Socket.IO Event] User ${socket.user.userId} successfully joined chat room ${chatId}`);
            } else {
                console.warn(`[Socket.IO Event] User ${socket.user.userId} tried to join unauthorized chat ${chatId}. Not a participant.`);
            }
        } catch (error) {
            console.error(`[Socket.IO Event] Error joining chat room ${chatId}:`, error);
        }
    });

    socket.on('leave_chat_room', (chatId) => {
        console.log(`[Socket.IO Event] ${new Date().toISOString()} - User ${socket.user.userId} left chat room ${chatId}.`);
        socket.leave(chatId);
    });

    socket.on('new_message', async ({ conversationId, receiverId, text, tempId }) => {
        console.log(`[Socket.IO Event] ${new Date().toISOString()} - Received 'new_message' from ${socket.user.userId} for chat ${conversationId}, receiver ${receiverId}, tempId: ${tempId || 'N/A'}`);
        try {
            const senderUserObj = await User.findById(socket.user.userId);
            if (!senderUserObj) {
                console.error(`[Socket.IO Event] ERROR: Sender user object not found for user_id: ${socket.user.userId}. Aborting message send.`);
                return;
            }

            const receiverUserObj = await User.findById(receiverId);
            if (!receiverUserObj) {
                console.error(`[Socket.IO Event] ERROR: Receiver user object not found for user_id: ${receiverId}. Aborting message send.`);
                return;
            }

            const conversation = await Conversation.findById(conversationId)
                .populate({
                    path: 'participants',
                    model: 'User',
                    select: 'user_id'
                });

            if (!conversation) {
                console.error(`[Socket.IO Event] ERROR: Conversation not found for ID: ${conversationId}. Aborting message send.`);
                return;
            }

            const isParticipant = conversation.participants.some(
                p => String(p._id) === String(socket.user.userId)
            );

            if (!isParticipant) {
                console.error(`[Socket.IO Event] ERROR: User ${socket.user.userId} is not a participant in conversation ${conversationId}. Aborting message send.`);
                return;
            }

            const message = await Message.create({
                sender: senderUserObj._id,
                receiver: receiverUserObj._id,
                content: text
            });

            conversation.lastMessage = message._id;
            conversation.lastMessageTime = new Date();
            await conversation.save();

            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'fullName profilePicture')
                .populate('receiver', 'fullName profilePicture');

            console.log(`[Socket.IO Event] Message saved successfully. Broadcasting to conversation ${conversationId}.`);

            io.to(conversationId).emit('message_received', {
                message: populatedMessage,
                tempId: tempId
            });

        } catch (error) {
            console.error(`[Socket.IO Event] Error processing new message:`, error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.IO Disconnection] ${new Date().toISOString()} - User disconnected: Socket ID: ${socket.id}, Auth User ID: ${socket.user.userId}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`[Server] Israel4U server running on port ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Server] Frontend URL: ${config.FRONTEND_URL}`);
}); 