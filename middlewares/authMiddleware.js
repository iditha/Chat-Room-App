module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn || !req.session.user) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }
    next(); // Continue to the next middleware/controller
};
