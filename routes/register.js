var express = require('express');
var router = express.Router();
const { registerUser, authenticateUser } = require('../models/users'); // Import functions

// Step 1: Render the registration form
router.get('/', function (req, res, next) {
  res.render('register', { error: '' });
});

// Step 1: Handle registration form submission
router.post('/', function (req, res, next) {
  const { email, firstName, lastName } = req.body;

  const namePattern = /^[a-zA-Z]{3,32}$/;

  // Validate first name and last name
  if (!namePattern.test(lastName) || !namePattern.test(firstName)) {
    return res.render('register', {
      error: 'First and Last names must contain only letters and be 3-32 characters long.',
    });
  }

  // Validate email length
  if (email.length < 3 || email.length > 32) {
    return res.render('register', {
      error: 'Email must be 3-32 characters long.',
    });
  }

  // Save basic info using the `registerUser` function
  try {
    registerUser(email, firstName, lastName); // Save email and names
    res.redirect('/register/password'); // Redirect to the password setup page
  } catch (err) {
    return res.render('register', { error: err.message });
  }
});

// Step 2: Render password setup form
router.get('/password', function (req, res, next) {
  res.render('registerPassword', {
    error: '',
    email: req.body.email,
  });
});

// Step 2: Handle password setup
router.post('/password', function (req, res, next) {
  const { email, password, confirmPassword } = req.body;

  // Validate password length
  if (password.length < 8 || password.length > 32) {
    return res.render('registerPassword', {
      error: 'Password must be 8-32 characters long.',
      email: req.body.email,
    });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render('registerPassword', {
      error: 'Passwords do not match.',
      email: req.body.email,
    });
  }

  // Complete registration using the `registerUser` function
  try {
    // Assuming email was saved during the first step
    registerUser(email, null, null, password); // Save the password
    res.render('login', { message: 'Registration successful! Please log in.' });
  } catch (err) {
    return res.render('registerPassword', {
      error: err.message,
      email: req.body.email
    });
  }
});

module.exports = router;
