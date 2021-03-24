/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../user/schema');
const { statusCodeMessages, statusCodes } = require('../../lib/statusCodes');

dotenv.config();

const verifyJWT = async (token) => {
	if (!token) return null;
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decodedToken;
		const user = await User.findById(id);
		if (!user) return null;
		return id;
	} catch (error) {
		return null;
	}
};

const AuthMiddleware = async (req, res, next) => {
	const { JWT_TOKEN } = req.cookies;
	const id = await verifyJWT(JWT_TOKEN);

	if (!id) {
		return res
			.status(statusCodes.UNAUTHORIZED)
			.json({ error: statusCodeMessages.UNAUTHORIZED });
	}
	res.locals.user = id;
	next();
};

module.exports = AuthMiddleware;
