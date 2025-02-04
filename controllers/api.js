const db = require('../models');
const consts = require('../public/javascripts/consts/serverConsts');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const isAuthenticated = (req, res) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).send({ error: consts.UNAUTHORIZED_ACCESS });
    }
    return true;
};

exports.getMessages = (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    return db.Message.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then((messages) => res.send(messages))
        .catch(() => res.status(400).send({ error: consts.MESSAGES_QUERY_FAILED }));
};

exports.searchMessagesByText = (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    const searchString = req.query.searchString;

    return db.Message.findAll({
        where: {
            content: {
                [Op.like]: `%${searchString}%`
            },
        },
        order: [['createdAt', 'DESC']]
    })
        .then((messages) => res.send(messages))
        .catch(() => res.status(400).send({ error: consts.MESSAGES_QUERY_FAILED }));
};

// Modifies the content of a message identified by messageId based on the provided content value
exports.modifyMessageContent = (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    const messageId = req.params.messageId;
    const { content } = req.body;

    return db.Message.findByPk(messageId)
        .then((message) => {
            if (!message) {
                return res.send({ message: consts.MESSAGE_UPDATED });
            }

            return message.update({ content })
                .then(() => res.send({ message: consts.MESSAGE_UPDATED }))
                .catch((updateError) => {
                    if (updateError instanceof Sequelize.ValidationError) {
                        return res.status(400).send({ error: consts.UPDATE_MESSAGE_VALIDATION_ERR });
                    } else {
                        return res.status(500).send({ error: consts.UPDATE_MESSAGE_FAILED });
                    }
                });
        })
        .catch(() => res.status(400).send({ error: consts.MESSAGE_QUERY_FAILED }));
};

exports.deleteMessage = (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    const messageId = req.params.messageId;

    return db.Message.findByPk(messageId)
        .then((message) => {
            if (!message) {
                return res.send({ message: consts.MESSAGE_DELETED });
            }

            return message.destroy()
                .then(() => res.send({ message: consts.MESSAGE_DELETED }))
                .catch((deleteErr) => {
                    if (deleteErr instanceof Sequelize.ValidationError) {
                        return res.status(400).send({ error: consts.DELETE_MESSAGE_VALIDATION_ERR });
                    } else {
                        return res.status(500).send({ error: consts.DELETE_MESSAGE_FAILED });
                    }
                });
        })
        .catch(() => res.status(400).send({ error: consts.MESSAGE_QUERY_FAILED }));
};
