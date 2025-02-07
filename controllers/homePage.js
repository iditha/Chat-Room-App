const consts = require('../public/javascripts/consts/serverConsts');

const Cookies = require("cookies");
exports.getHomePage = (req, res) => {
    res.render('homePage', {
        firstName: req.session.user.firstName,
        message: ''
    });
};

// Handles user logout. If successful, redirects to the login page; otherwise, renders an error page.
exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { title: consts.INTERNAL_SERVER_ERR, message: consts.GENERAL_LOGOUT_ERR_MSG });
        }

        res.redirect('/');
    });
};
