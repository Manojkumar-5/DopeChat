const express = require('express');
const bodyParser = require('body-parser');
const AuthMiddleware = require('../middleware/Auth');
const {
	findUser,
	getUserId,
	userDisconnect,
	userOnline,
} = require('./controller');

const UrlEncodedParser = bodyParser.urlencoded({ extended: false });
const JsonParser = bodyParser.json();

const userRouter = express.Router();

userRouter.get(
	'/match',
	AuthMiddleware,
	UrlEncodedParser,
	JsonParser,
	findUser
);
userRouter.get('/id', AuthMiddleware, UrlEncodedParser, JsonParser, getUserId);

userRouter.post('/disconnect', UrlEncodedParser, JsonParser, userDisconnect);

userRouter.patch('/online', AuthMiddleware, userOnline);

module.exports = userRouter;
