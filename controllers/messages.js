const Cookies = require('cookies'); // Import the cookies package
const consts = require('../public/javascripts/consts/serverConsts');
const db = require('../models');
const Sequelize = require('sequelize');


exports.getAddMessage = (req, res) => {

    res.render('addMessage', {error: null});
};

exports.postAddMessage = async (req, res) => {
    try {
        const { messageText } = req.body;

        // Create a new message linked to the logged-in user
        await db.Message.create({
            content: messageText,
            userId: req.session.user.id // Associate message with user
        });

        res.redirect('/homePage');
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            res.render('addMessage', { error: `Invalid input: ${err}` });
        } else if (err instanceof Sequelize.DatabaseError) {
            res.render('addMessage', { error: `Database error: ${err}` });
        } else {
            res.render('addMessage', { error: `Unexpected error: ${err}` });
        }
    }
};
