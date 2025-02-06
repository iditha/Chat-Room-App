const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');

router.get('/messages', apiController.getMessages);

router.get('/messages/search', apiController.searchMessagesByText);

router.put('/messages/:messageId', apiController.modifyMessageContent);

router.delete('/messages/:messageId', apiController.deleteMessage);

router.get('/messages/latest-update', apiController.getLatestUpdateTime);

module.exports = router;