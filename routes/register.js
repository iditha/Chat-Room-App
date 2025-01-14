var express = require('express');
var router = express.Router();

// Step 1: Render the registration form
router.get('/', function (req, res, next) {
  res.render('register', { error: '' });
});

// Step 1: Handle registration form submission
router.post('/', function (req, res, next) {
  const { email, firstName, lastName } = req.body;

  const namePattern = /^[a-zA-Z]{3,32}$/;

  if (!namePattern.test(lastName) || !namePattern.test(firstName)) {
    return res.render('register', {
      error: 'First and Last names must contain only letters and be 3-32 characters long.',
    });
  }

  if (email.length < 3 || email.length > 32) {
    return res.render('register', {
      error: 'Email must be 3-32 characters long.',
    });
  }

  // Save basic info to session or database (mocked here)
  //req.session.registrationData = { email, firstName, lastName };

  // Redirect to password setup
  res.redirect('/register/password');
});

// Step 2: Render password setup form
router.get('/password', function (req, res, next) {
  res.render('registerPassword', { error: '' });
});

// Step 2: Handle password setup
router.post('/password', function (req, res, next) {
  const { password, confirmPassword } = req.body;

  if (password.length < 8 || password.length > 32) {
    return res.render('registerPassword', {
      error: 'Password must be 8-32 characters long.',
    });
  }

  if (password !== confirmPassword) {
    return res.render('registerPassword', {
      error: 'Passwords do not match.',
    });
  }

  // Complete registration (mock saving to DB)
  //const registrationData = req.session.registrationData || {};
  //registrationData.password = password;

  // Save to DB or confirm success (mocked here)
  //console.log('Registered User:', registrationData);

  // Render login
  return res.render('login', { message: 'Registration successful! Please log in.' });

});

// Step 3: Render registration completion page
//router.get('/complete', function (req, res, next) {
 // res.render('register-complete', { message: 'Registration successful! Please log in.' });
//});

module.exports = router;
