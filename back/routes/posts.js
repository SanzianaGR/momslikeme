const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, getClerkUserId } = require('../middleware/auth');
const { getAuth } = require('@clerk/express');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        
        // Transform to match expected format (simulate populate)
        const transformedPosts = posts.map(post => ({
            _id: post._id,
            title: post.title,
            content: post.content,
            author: {
                _id: post.author,
                username: post.authorName
            },
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            score: post.score,
            createdAt: post.createdAt
        }));
        
        res.json(transformedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, authorName } = req.body;
        const auth = getAuth(req);

        if (!title || !content) {
            return res.status(400).json({ error: 'Please add all fields' });
        }

        const post = await Post.create({
            title,
            content,
            author: auth.userId,
            authorName: authorName || 'Anonymous'
        });

        // Return in expected format
        res.status(201).json({
            _id: post._id,
            title: post.title,
            content: post.content,
            author: {
                _id: post.author,
                username: post.authorName
            },
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            score: post.score,
            createdAt: post.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Vote on a post (upvote or downvote)
// @route   POST /api/posts/:id/vote
// @access  Private
router.post('/:id/vote', protect, async (req, res) => {
    try {
        const { type } = req.body; // 'upvote' or 'downvote'
        const post = await Post.findById(req.params.id);
        const auth = getAuth(req);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userId = auth.userId;

        // Remove existing vote if any
        post.upvotes = post.upvotes.filter(id => id !== userId);
        post.downvotes = post.downvotes.filter(id => id !== userId);

        if (type === 'upvote') {
            post.upvotes.push(userId);
        } else if (type === 'downvote') {
            post.downvotes.push(userId);
        } else {
            return res.status(400).json({ error: 'Invalid vote type' });
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
