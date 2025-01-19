const User = require('../models/users'); // Import the User model

exports.getRegister = (req, res) => {
    const message = req.query.message || '';
    res.render('register', { error: message });
};

exports.postRegister = (req, res) => {
    const { email, firstName, lastName } = req.body;

    try {
        // Validate input using the User model
        User.validateInput(email, firstName, lastName);

        // Check if the email already exists in the system
        if (User.exists(email)) {
            throw new Error('Email already exists. Please use a different email.');
        }

        res.redirect(`/register/password?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`);
    } catch (err) {
        res.render('register', { error: err.message });
    }
};

exports.getRegisterPassword = (req, res) => {
    const { email, firstName, lastName } = req.query;

    try {
        // Validate input using the User model
        User.validateInput(email, firstName, lastName);

        res.render('registerPassword', {
            email,
            firstName,
            lastName,
            error: '', // Empty error message by default
        });
    } catch (err) {
        res.redirect('/register'); // Redirect to registration if validation fails
    }
};

exports.postRegisterPassword = (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    try {
        // Validate password using the User model
        User.validatePassword(password, confirmPassword);

        const user = new User(email, firstName, lastName, password);
        user.save(); // Save user to database

        // Redirect with success message and success flag
        res.redirect('/?message=Registration successful! Please log in.&isSuccess=true');
    } catch (err) {
        res.render('registerPassword', {
            error: err.message,
            email,
            firstName,
            lastName,
        });
    }
};

