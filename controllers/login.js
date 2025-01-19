exports.getLogin = (req, res) => {
    const message = req.query.message || '';
    const isSuccess = req.query.isSuccess === 'true'; // Parse the success flag

    res.render('login', { message, isSuccess });
};
