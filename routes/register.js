var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register');


// Step 1: Render the registration form
router.get('/', registerController.getRegister);


// Step 1: Handle registration form submission
router.post('/', registerController.postRegister);


// Step 2: Render password setup form
router.get('/password', registerController.getRegisterPassword);


// Step 2: Handle password setup
router.post('/password', registerController.postRegisterPassword);


module.exports = router;
