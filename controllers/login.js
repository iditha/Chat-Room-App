const User = require('../models/user');
const db = require('../models');
const Cookies = require('cookies');

exports.getLogin = (req, res) => {
    const cookies = new Cookies(req, res);

    // Retrieve and then clear cookies
    const message = cookies.get('message') || '';
    const isSuccess = cookies.get('isSuccess') === 'true';
    const savedEmail = cookies.get('savedEmail') || ''; // Retrieve saved email
    const savedPassword = cookies.get('savedPassword') || ''; // Retrieve saved password

    cookies.set('message'); // Clear the message cookie
    cookies.set('isSuccess'); // Clear the isSuccess cookie

    if (req.session.isLoggedIn) {
        return res.redirect('/homePage');
    }

    res.render('login', { message, isSuccess, email: savedEmail, password: savedPassword });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const cookies = new Cookies(req, res);

    try {
        // Validate input fields
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Find user by email
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password.');
        }

        // Validate password using bcrypt
        const isValidPassword = await user.validPassword(password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password.');
        }

        // Save session
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id, email, firstName: user.firstName };

        // Clear cookies on successful login
        cookies.set('message');
        cookies.set('isSuccess');
        cookies.set('savedEmail');
        cookies.set('savedPassword');

        // Redirect to home page
        res.redirect('/homePage');
    } catch (err) {
        // Store error message and keep email & password in cookies
        cookies.set('message', err.message, { maxAge: 5000 });
        cookies.set('isSuccess', 'false', { maxAge: 5000 });
        cookies.set('savedEmail', email, { maxAge: 5000 });
        cookies.set('savedPassword', password, { maxAge: 5000 });

        // Redirect to login page
        res.redirect('/');
    }
};
