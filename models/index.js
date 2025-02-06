const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.User = require('./user')(sequelize);
db.Message = require('./message')(sequelize);

// Define relationships (after models are initialized)
db.User.hasMany(db.Message, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});
db.Message.belongsTo(db.User, {
    foreignKey: 'userId',
});

module.exports = db;