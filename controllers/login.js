const db = require('../models');

exports.getLogin = (req, res) => {
    const message = req.query.message || '';
    const isSuccess = req.query.isSuccess === 'true';

    res.render('login', { message, isSuccess });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

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

        // Redirect to the home page on successful login
        res.redirect('/homePage');
    } catch (err) {
        // Redirect back to the login page with an error message
        res.redirect(`/?message=${encodeURIComponent(err.message)}&isSuccess=false`);
    }
};
