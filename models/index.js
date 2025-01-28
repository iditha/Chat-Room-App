const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Pass the sequelize instance to the User model
db.User = require('./user')(sequelize);

module.exports = db;
