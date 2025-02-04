const Cookies = require('cookies'); // Import the cookies package
const consts = require('../public/javascripts/consts/serverConsts');
const db = require('../models');
const Sequelize = require('sequelize');

exports.getRegister = (req, res) => {
    const cookies = new Cookies(req, res);

    // Retrieve cookies for email, firstName, and lastName
    const email = cookies.get('email') || '';
    const firstName = cookies.get('firstName') || '';
    const lastName = cookies.get('lastName') || '';
    const cookieTimestamp = cookies.get('registerTimestamp');

    // Check if cookies are still valid (not expired)
    const now = Date.now();
    const isCookieValid =
        cookieTimestamp && now - parseInt(cookieTimestamp) < consts.REGISTER;

    // Pass the variables to the view with appropriate defaults
    res.render('register', {
        error: '',
        email: isCookieValid ? email : '',
        firstName: isCookieValid ? firstName : '',
        lastName: isCookieValid ? lastName : '',
    });
};

exports.postRegister = async (req, res) => {
    const { email, firstName, lastName } = req.body;
    const cookies = new Cookies(req, res);

    try {
        // Check if the email already exists in the database
        // Case-insensitive search using LOWER()
        const existingUser = await db.User.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('email')),
                email.toLowerCase()
            ),
        });
        if (existingUser) {
            throw new Error('Email already exists. Please use a different email.');
        }

        // Save user data in cookies with a 30-second expiration
        cookies.set('email', email, { maxAge: consts.REGISTER });
        cookies.set('firstName', firstName, { maxAge: consts.REGISTER });
        cookies.set('lastName', lastName, { maxAge: consts.REGISTER });
        cookies.set('registerTimestamp', Date.now().toString(), {
            maxAge: consts.REGISTER,
        });

        res.redirect(`/register/password`);
    } catch (err) {
        res.render('register', {
            error: err.message,
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || '',
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
    const isCookieValid =
        cookieTimestamp && now - parseInt(cookieTimestamp) < consts.REGISTER;

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

exports.postRegisterPassword = async (req, res) => {
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
        // Validate password match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match.');
        }

        // Save the user in the database
        await db.User.create({ email, firstName, lastName, password });

        // Clear cookies after successful registration
        cookies.set('email');
        cookies.set('firstName');
        cookies.set('lastName');
        cookies.set('registerTimestamp');
        // Store success message in cookies
        cookies.set('message', 'Registration successful! Please log in.', { maxAge: 5000 });
        cookies.set('isSuccess', 'true', { maxAge: 5000 });

        res.redirect('/');
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            res.render('register', {
                error: `Invalid input: ${err}`,
                email,
                firstName,
                lastName,
            });
        } else if (err instanceof Sequelize.DatabaseError) {
            res.render('register', {
                error: `Database error: ${err}`,
                email,
                firstName,
                lastName,
            });
        } else {
            res.render('register', {
                error: `Unexpected error: ${err}`,
                email,
                firstName,
                lastName,
            });
        }
    }
};
