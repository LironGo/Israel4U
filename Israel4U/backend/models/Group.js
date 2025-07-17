const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    region: {
        type: String,
        enum: ['צפון', 'מרכז', 'דרום', 'שפלה'],
        required: true
    },
    groupPicture: {
        type: String,
        default: 'default-group.jpg'
    },
    // Group categories
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
    // Group management
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Join requests
    joinRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        requestDate: {
            type: Date,
            default: Date.now
        }
    }],
    // Group settings
    isPrivate: {
        type: Boolean,
        default: false
    },
    // Pinned posts
    pinnedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true
});

// Index for search functionality
groupSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Group', groupSchema); 