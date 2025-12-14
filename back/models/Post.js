const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    // Clerk user ID (string, e.g., "user_abc123")
    author: {
        type: String,
        required: true
    },
    // Store author display name for easier querying
    authorName: {
        type: String,
        default: 'Anonymous'
    },
    upvotes: [{
        type: String // Clerk user IDs
    }],
    downvotes: [{
        type: String // Clerk user IDs
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate score dynamically
postSchema.virtual('score').get(function () {
    return (this.upvotes ? this.upvotes.length : 0) - (this.downvotes ? this.downvotes.length : 0);
});

module.exports = mongoose.model('Post', postSchema);
