var express = require('express');
var router = express.Router();
const messageController = require('../controllers/messages');

router.get('/add', messageController.getAddMessage);

router.post('/add', messageController.postAddMessage);

module.exports = router;