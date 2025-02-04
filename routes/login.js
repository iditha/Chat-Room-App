var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login');
const checkAlreadyLoggedIn = require('../middlewares/checkAlreadyLoggedIn');

/* GET login page. */
router.get('/', checkAlreadyLoggedIn, loginController.getLogin);

/* POST login credentials */
router.post('/', loginController.postLogin);

module.exports = router;
