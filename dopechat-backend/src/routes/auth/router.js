const express = require('express');
const bodyParser = require('body-parser');
const JoiMiddleware = require('../middleware/Joi');
const AuthMiddleware = require('../middleware/Auth');
const { loginSchema, signupSchema } = require('../../lib/joi/authSchemas');
const { login, logout, signup } = require('./controller');

const UrlEncodedParser = bodyParser.urlencoded({ extended: false });
const JsonParser = bodyParser.json();

const authRouter = express.Router();

authRouter.post(
	'/login',
	UrlEncodedParser,
	JsonParser,
	JoiMiddleware(loginSchema),
	login
);
authRouter.post('/logout', AuthMiddleware, logout);
authRouter.post(
	'/signup',
	UrlEncodedParser,
	JsonParser,
	JoiMiddleware(signupSchema),
	signup
);

module.exports = authRouter;
