const { clerkMiddleware, getAuth, requireAuth } = require('@clerk/express');

// Middleware to protect routes - requires authentication
const protect = requireAuth();

// Helper to get user ID from Clerk auth
const getClerkUserId = (req) => {
    const auth = getAuth(req);
    return auth?.userId || null;
};

module.exports = { protect, getClerkUserId, clerkMiddleware };
