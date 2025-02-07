const db = require('../models');
const consts = require('../public/javascripts/consts/serverConsts');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const { Message } = require('../models');


const isAuthenticated = (req, res) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).send({ error: consts.UNAUTHORIZED_ACCESS });
    }
    return true;
};


exports.getMessages = async (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    try {
        const userId = req.session.user.id; // Ensure this is correct

        const messages = await Message.findAll({
            include: { model: require('../models').User, attributes: ['firstName', 'lastName'] },
            order: [['createdAt', 'DESC']],
        });

        const updatedMessages = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            createdAt: new Date(msg.createdAt).toLocaleString(),
            updatedAt: new Date(msg.updatedAt).toLocaleString(),
            User: msg.User,
            approved: parseInt(msg.userId) === parseInt(userId), // Ensure correct comparison
        }));

        res.json(updatedMessages);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch messages' });
    }
};


exports.searchMessagesByText = async (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    const searchString = req.query.searchString;
    const userId = req.session.user.id; // Get current logged-in user ID

    try {
        const messages = await db.Message.findAll({
            where: {
                content: {
                    [Op.like]: `%${searchString}%`
                },
            },
            include: { model: db.User, attributes: ['firstName', 'lastName'] },
            order: [['createdAt', 'DESC']]
        });

        const updatedMessages = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            User: msg.User,
            approved: parseInt(msg.userId) === parseInt(userId) // Ensure correct comparison
        }));

        res.json(updatedMessages);
    } catch (error) {
        res.status(400).json({ error: consts.MESSAGES_QUERY_FAILED });
    }
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


exports.getLatestUpdateTime = async (req, res) => {
    if (isAuthenticated(req, res) !== true) return;

    try {
        const latestMessage = await db.Message.findOne({
            attributes: ['updatedAt'],
            order: [['updatedAt', 'DESC']],
            paranoid: false,
        });

        if (!latestMessage) {
            return res.json({ latestUpdatedAt: null });
        }

        res.json({ latestUpdatedAt: latestMessage.updatedAt });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch latest update time' });
    }
};
