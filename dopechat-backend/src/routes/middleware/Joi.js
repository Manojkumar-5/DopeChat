/* eslint-disable consistent-return */
const { statusCodes } = require('../../lib/statusCodes');

const JoiMiddleware = (schema, key = 'body') => {
	const validate = (req, res, next) => {
		const { error, value } = schema.validate(req[key]);
		if (error) return res.status(statusCodes.BAD_REQUEST).send(error);
		req.body = value;
		next();
	};
	return validate;
};

module.exports = JoiMiddleware;
