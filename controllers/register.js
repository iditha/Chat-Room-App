const User = require('../models/users'); // Import the User model
const Cookies = require('cookies'); // Import the cookies package
const consts = require('../public/javascripts/consts/serverConsts');

exports.getRegister = (req, res) => {
    const cookies = new Cookies(req, res);

    // Retrieve cookies for email, firstName, and lastName
    const email = cookies.get('email') || '';
    const firstName = cookies.get('firstName') || '';
    const lastName = cookies.get('lastName') || '';
    const cookieTimestamp = cookies.get('registerTimestamp');

    // Check if cookies are still valid (not expired)
    const now = Date.now();
    const isCookieValid = cookieTimestamp && now - parseInt(cookieTimestamp) < consts.REGISTER;

    // Pass the variables to the view with appropriate defaults
    res.render('register', {
        error: '',
        email: isCookieValid ? email : '',
        firstName: isCookieValid ? firstName : '',
        lastName: isCookieValid ? lastName : ''
    });
};


exports.postRegister = (req, res) => {
    const { email, firstName, lastName } = req.body;
    const cookies = new Cookies(req, res);

    try {
        // Validate input using the User model
        User.validateInput(email, firstName, lastName);

        // Check if the email already exists in the system
        if (User.exists(email)) {
            throw new Error('Email already exists. Please use a different email.');
        }

        // Save user data in cookies with a 30-second expiration
        cookies.set('email', email, { maxAge: consts.REGISTER });
        cookies.set('firstName', firstName, { maxAge: consts.REGISTER });
        cookies.set('lastName', lastName, { maxAge: consts.REGISTER });
        cookies.set('registerTimestamp', Date.now().toString(), { maxAge: consts.REGISTER });

        res.redirect(`/register/password`);
    } catch (err) {
        // Re-render the form with the entered data and the error message
        res.render('register', {
            error: err.message,
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || ''
        });
    }
};


exports.getRegisterPassword = (req, res) => {
    const cookies = new Cookies(req, res);

    // Retrieve user data and timestamp from cookies
    const email = cookies.get('email');
    const firstName = cookies.get('firstName');
    const lastName = cookies.get('lastName');
    const cookieTimestamp = cookies.get('registerTimestamp');

    // Check if cookies are valid
    const now = Date.now();
    const isCookieValid = cookieTimestamp && now - parseInt(cookieTimestamp) < consts.REGISTER;

    if (isCookieValid && email && firstName && lastName) {
        return res.render('registerPassword', {
            email,
            firstName,
            lastName,
            error: '', // No error by default
        });
    }

    // If cookies are expired or invalid, redirect to the first registration page
    res.redirect('/register');
};

exports.postRegisterPassword = (req, res) => {
    const cookies = new Cookies(req, res);
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    // Retrieve the timestamp from cookies
    const cookieTimestamp = cookies.get('registerTimestamp');
    const now = Date.now();

    // Check if cookies are valid
    const isCookieValid = cookieTimestamp && now - parseInt(cookieTimestamp) < consts.REGISTER;

    if (!isCookieValid) {
        // If cookies have expired, redirect to the first step with a reset form
        return res.redirect('/register');
    }

    try {
        // Validate password using the User model
        User.validatePassword(password, confirmPassword);

        const user = new User(email, firstName, lastName, password);
        user.save(); // Save user to the database

        // Clear cookies after successful registration
        //cookies.set('email');
        //cookies.set('firstName');
        //cookies.set('lastName');
        //cookies.set('registerTimestamp');

        // Redirect with a success message
        res.redirect('/?message=Registration successful! Please log in.&isSuccess=true');
    } catch (err) {
        res.render('register', {
            error: err.message,
            email,
            firstName,
            lastName,
        });
    }
};
