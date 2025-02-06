'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Message', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    }, {
        paranoid: true, // Enables soft delete
        timestamps: true, // Ensures createdAt, updatedAt, and deletedAt are managed
    });
};
