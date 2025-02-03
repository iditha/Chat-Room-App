const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Import database from models/index.js
const db = require('./models');
const sequelize = db.sequelize;

// Perform database authentication and sync
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Routers
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const homePageRouter = require('./routes/homePage');
const messageHandlerRouter = require('./routes/messageFormHandler');


// Configure session store
const myStore = new SequelizeStore({
    db: sequelize,
});

// Create the Express app
const app = express();

// Enable sessions
app.use(
    session({
        secret: 'idit key',
        store: myStore,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 10 * 60 * 1000 }, // 10 minutes
    })
);

// Sync the session store
myStore.sync();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to protect /homePage
app.use('/homePage', (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
});

// Routes
app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/homePage', homePageRouter);
app.use('/message', messageHandlerRouter);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
