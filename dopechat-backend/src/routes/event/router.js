const express = require('express');
const Multer = require('multer');
const bodyParser = require('body-parser');
const AuthMiddleware = require('../middleware/Auth');
const JoiMiddleware = require('../middleware/Joi');
const {
	createMessageEventSchema,
	editDeleteMessageEventSchema,
	fetchMessageEventsSchema,
} = require('../../lib/joi/eventSchemas');
const {
	createNewMessageEvent,
	editDeleteMessageEvent,
	fetchMessageEvents,
	fileUploadEvent,
} = require('./controller');

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
	},
});

const UrlEncodedParser = bodyParser.urlencoded({ extended: false });
const JsonParser = bodyParser.json();

const eventRouter = express.Router();

eventRouter.post(
	'/create',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	JoiMiddleware(createMessageEventSchema),
	createNewMessageEvent
);

eventRouter.post(
	'/edit',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	JoiMiddleware(editDeleteMessageEventSchema),
	editDeleteMessageEvent
);

eventRouter.get(
	'/list',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	JoiMiddleware(fetchMessageEventsSchema, 'query'),
	fetchMessageEvents
);

eventRouter.post('/upload', multer.single('file'), fileUploadEvent);

module.exports = eventRouter;
