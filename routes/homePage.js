var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('homePage', {
        firstName: req.session.user.firstName,
        message: ''
    });
});


module.exports = router;

