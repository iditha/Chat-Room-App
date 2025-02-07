var express = require('express');
var router = express.Router();
const homePageController = require('../controllers/homePage');

/* GET home page. */
router.get('/', homePageController.getHomePage)

router.post('/logout', homePageController.postLogout);

module.exports = router;

