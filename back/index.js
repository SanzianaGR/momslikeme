require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { clerkMiddleware } = require('./middleware/auth');

const benefitsRoutes = require('./routes/benefits');
const matchRoutes = require('./routes/match');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const greenptRoutes = require('./routes/greenpt');

const app = express();
const port = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Add Clerk middleware for auth

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Hulpwijzer API',
        endpoints: {
            'GET /api/benefits': 'List all benefits',
            'POST /api/benefits/match': 'AI-powered eligibility matching',
            'POST /api/auth/register': 'Register a new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/posts': 'List forum posts',
            'POST /api/posts': 'Create forum post',
            'POST /api/greenpt/chat': 'Chat with greenPT AI',
            'POST /api/greenpt/transcribe': 'Transcribe audio (not yet implemented)',
        }
    });
});

app.use('/api/benefits', benefitsRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/greenpt', greenptRoutes);

// Start server
app.listen(port, () => {
    console.log(`🧭 Hulpwijzer Backend listening on port ${port}`);
});
