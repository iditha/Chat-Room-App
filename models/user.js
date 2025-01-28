'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    len: [3, 32],
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 32],
                    isAlphaOnly(value) {
                        if (!/^[a-zA-Z]+$/.test(value)) {
                            throw new Error(
                                'First name must contain only alphabetic characters (A-Z, a-z).'
                            );
                        }
                    },
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 32],
                    isAlphaOnly(value) {
                        if (!/^[a-zA-Z]+$/.test(value)) {
                            throw new Error(
                                'Last name must contain only alphabetic characters (A-Z, a-z).'
                            );
                        }
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 32],
                },
            },
        },
        {
            hooks: {
                beforeCreate(user) {
                    user.email = user.email.toLowerCase();
                },
                beforeUpdate(user) {
                    user.email = user.email.toLowerCase();
                },
            },
            modelName: 'User',
        }
    );

    return User;
};
