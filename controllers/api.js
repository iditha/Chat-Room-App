const db = require('../models');
const consts = require('../public/javascripts/consts/serverConsts');
const {Op} = require('sequelize');
const Sequelize = require('sequelize');


exports.getMessages = (req, res) => {
    return db.Message.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then((ads) => res.send(ads))
        .catch(() => res.status(400).send({error: consts.MESSAGES_QUERY_FAILED}));
};

exports.searchMessagesByText = (req, res) => {
    const searchString = req.query.searchString;

    return db.Message.findAll({
        where: {
            content: {
                [Op.like]: `%${searchString}%`
            },
        },
        order: [['createdAt', 'DESC']]
    })
        .then((ads) => res.send(ads))
        .catch(() => res.status(400).send({error: consts.MESSAGES_QUERY_FAILED}));
};

// Modifies the content of a message identified by messageId based on the provided content value
exports.modifyMessageContent = (req, res) => {
    const messageId = req.params.messageId;
    const { content } = req.body;

    return db.Message.findByPk(messageId)
        .then((message) => {
            if (!message) {
                // If trying to update a message that doesn't exist, consider it a success for UX
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
    const messageId = req.params.messageId;

    return db.Message.findByPk(messageId)
        .then((message) => {
            if (!message) {
                // If trying to delete a message that doesn't exist, consider it a success for UX
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

