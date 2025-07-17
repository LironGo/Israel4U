const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    content: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String
    }],
    // Post categories
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
    // Post type
    postType: {
        type: String,
        enum: ['help_request', 'support_offer', 'general', 'emergency'],
        default: 'general'
    },
    // Location for help requests
    location: {
        type: String
    },
    // Post status
    isPinned: {
        type: Boolean,
        default: false
    },
    isSaved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Interaction counts
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
postSchema.index({ content: 'text', location: 'text' });

module.exports = mongoose.model('Post', postSchema); 