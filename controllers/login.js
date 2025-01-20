const User = require('../models/users');

exports.getLogin = (req, res) => {
    const message = req.query.message || '';
    const isSuccess = req.query.isSuccess === 'true';

    res.render('login', { message, isSuccess });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input fields
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Find the user by email
        const user = User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password.');
        }

        // Validate password
        if (user.password !== password) {
            throw new Error('Invalid email or password.');
        }

        // Redirect to the home page on successful login
        res.redirect('/homePage');
    } catch (err) {
        // Redirect back to the login page with an error message
        res.redirect(`/?message=${encodeURIComponent(err.message)}&isSuccess=false`);
    }
};
