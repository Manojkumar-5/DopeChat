const Joi = require('joi');

const createMessageEventSchema = Joi.object({
	chatRecordId: Joi.string().required(),
	message: Joi.string().required(),
	isFile: Joi.boolean().required(),
});

const editDeleteMessageEventSchema = Joi.object({
	chatRecordId: Joi.string().required(),
	message: Joi.string(),
	messageNumber: Joi.number().integer().greater(0).required(),
});

const fetchMessageEventsSchema = Joi.object({
	chatRecordId: Joi.string().required(),
	eventListLength: Joi.number().integer().greater(0),
	firstMessageNumber: Joi.number().integer().greater(0),
});

module.exports = {
	createMessageEventSchema,
	editDeleteMessageEventSchema,
	fetchMessageEventsSchema,
};
