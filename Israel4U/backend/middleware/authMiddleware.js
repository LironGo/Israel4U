const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const config = require('../config/config');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }
            
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isGroupManager) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
});

module.exports = { protect, admin }; 