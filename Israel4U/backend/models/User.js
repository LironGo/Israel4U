const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        default: () => 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    region: {
        type: String,
        enum: ['צפון', 'מרכז', 'דרום', 'שפלה'],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default-profile.jpg'
    },
    // User categories
    isEvacuee: {
        type: Boolean,
        default: false
    },
    isInjured: {
        type: Boolean,
        default: false
    },
    isReservist: {
        type: Boolean,
        default: false
    },
    isRegularSoldier: {
        type: Boolean,
        default: false
    },
    isGroupManager: {
        type: Boolean,
        default: false
    },
    // Friends and connections
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Groups user is member of
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    // Groups user manages
    managedGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: {
        type: String
    },
    emailVerificationExpires: {
        type: Date
    },
    // Password reset
    passwordResetCode: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification code
userSchema.methods.generateEmailVerificationCode = function() {
    this.emailVerificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return this.emailVerificationCode;
};

// Method to generate password reset code
userSchema.methods.generatePasswordResetCode = function() {
    this.passwordResetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return this.passwordResetCode;
};

module.exports = mongoose.model('User', userSchema); 