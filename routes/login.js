var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login');

/* GET login page. */
router.get('/', loginController.getLogin);

module.exports = router;
