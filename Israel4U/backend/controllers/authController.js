const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { sendEmailVerification, sendPasswordResetEmail } = require('../utils/emailService');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullName, phone, region, city, isEvacuee, isInjured, isReservist, isRegularSoldier } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        email,
        password,
        fullName,
        phone,
        region,
        city,
        isEvacuee,
        isInjured,
        isReservist,
        isRegularSoldier
    });

    if (user) {
        // Check if email credentials are configured
        if (config.EMAIL_USER && config.EMAIL_PASS) {
            // Send email verification
            const verificationCode = user.generateEmailVerificationCode();
            await user.save();
            
            try {
                await sendEmailVerification(user.email, verificationCode);
                res.status(201).json({
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    message: 'Registration successful! Please check your email for verification code.',
                    token: null // No token until email is verified
                });
            } catch (error) {
                console.error('Email sending failed:', error);
                // If email sending fails, automatically verify for development
                user.isEmailVerified = true;
                user.emailVerificationCode = undefined;
                user.emailVerificationExpires = undefined;
                await user.save();
                
                res.status(201).json({
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    message: 'Registration successful! You can now login.',
                    token: generateToken(user._id)
                });
            }
        } else {
            // For development without email credentials, automatically verify
            user.isEmailVerified = true;
            await user.save();

            res.status(201).json({
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                message: 'Registration successful! You can now login.',
                token: generateToken(user._id)
            });
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isEmailVerified) {
        res.status(400);
        throw new Error('Email already verified');
    }

    if (user.emailVerificationCode !== code) {
        res.status(400);
        throw new Error('Invalid verification code');
    }

    if (user.emailVerificationExpires < new Date()) {
        res.status(400);
        throw new Error('Verification code expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
        message: 'Email verified successfully',
        token: generateToken(user._id)
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        if (!user.isEmailVerified) {
            res.status(401);
            throw new Error('Please verify your email first');
        }

        res.json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            region: user.region,
            city: user.city,
            isGroupManager: user.isGroupManager,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const resetCode = user.generatePasswordResetCode();
    await user.save();

    await sendPasswordResetEmail(user.email, resetCode);

    res.json({
        message: 'Password reset code sent to your email'
    });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.passwordResetCode !== code) {
        res.status(400);
        throw new Error('Invalid reset code');
    }

    if (user.passwordResetExpires < new Date()) {
        res.status(400);
        throw new Error('Reset code expired');
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
        message: 'Password reset successfully'
    });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('friends', 'fullName email profilePicture');
    res.json(user);
});

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    getMe
}; 