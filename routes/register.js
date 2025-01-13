var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { error: '' });
});

router.post('/register', function (req, res, next) {
  const { email, firstName, lastName } = req.body;

  // Validation patterns
  const namePattern = /^[a-zA-Z]{3,32}$/; // Only letters, 3-32 chars

  // Validate first and last names
  if (!namePattern.test(lastName) || !namePattern.test(firstName)) {
    return res.render('register', {
      error: 'First and Last names must contain only letters and be 3-32 characters long.',
    });
  }

  // Validate email
  if ( email.length < 3 || email.length > 32) {
    return res.render('register', {
      error: 'Email must be 3-32 characters long.',
    });
  }

  // If all validations pass
  res.render('register', { error: null });
});

module.exports = router;
