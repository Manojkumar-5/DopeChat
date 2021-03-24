const express = require('express');
const bodyParser = require('body-parser');
const AuthMiddleware = require('../middleware/Auth');
const { updateSeen, updateSeenDelivered } = require('./controller');

const UrlEncodedParser = bodyParser.urlencoded({ extended: false });
const JsonParser = bodyParser.json();

const timestampRouter = express.Router();

timestampRouter.patch(
	'/update',
	AuthMiddleware,
	JsonParser,
	UrlEncodedParser,
	updateSeenDelivered
);
timestampRouter.patch(
	'/update/seen',
	AuthMiddleware,
	JsonParser,
	UrlEncodedParser,
	updateSeen
);

module.exports = timestampRouter;
