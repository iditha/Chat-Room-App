var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register');
const checkAlreadyLoggedIn = require('../middlewares/checkAlreadyLoggedIn');


// Step 1: Render the registration form
router.get('/', checkAlreadyLoggedIn, registerController.getRegister);


// Step 1: Handle registration form submission
router.post('/', registerController.postRegister);


// Step 2: Render password setup form
router.get('/password', checkAlreadyLoggedIn, registerController.getRegisterPassword);


// Step 2: Handle password setup
router.post('/password', registerController.postRegisterPassword);


module.exports = router;
