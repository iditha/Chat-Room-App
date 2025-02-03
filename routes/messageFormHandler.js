const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to protect message-related routes
router.get('/add', authMiddleware, messageController.getAddMessage);
router.post('/add', authMiddleware, messageController.postAddMessage);

module.exports = router;
