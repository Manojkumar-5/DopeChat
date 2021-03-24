const express = require('express');
const bodyParser = require('body-parser');
const AuthMiddleware = require('../middleware/Auth');
const {
	createChatRecord,
	loadChatList,
	getUnreadMessagesForChatRoom,
} = require('./controller');

const UrlEncodedParser = bodyParser.urlencoded({ extended: false });
const JsonParser = bodyParser.json();

const chatRouter = express.Router();

chatRouter.post(
	'/create',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	createChatRecord
);
chatRouter.get(
	'/list',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	loadChatList
);
chatRouter.get(
	'/unread',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	getUnreadMessagesForChatRoom
);

module.exports = chatRouter;
