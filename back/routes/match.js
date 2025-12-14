
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// POST /api/match - Run full matching flow
router.post('/', matchController.processMatch);

module.exports = router;
