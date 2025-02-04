'use strict';

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
                beforeCreate: async (user) => {
                    user.email = user.email.toLowerCase(); // Convert email to lowercase
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                },
                beforeUpdate: async (user) => {
                    if (user.changed('email')) {
                        user.email = user.email.toLowerCase(); // Convert email to lowercase on update
                    }
                    if (user.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },

            modelName: 'User',
        }
    );

    // Function to compare passwords
    User.prototype.validPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    return User;
};
