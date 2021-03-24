const { ValidationError } = require('joi');
const jwt = require('jsonwebtoken');
const { statusCodes, statusCodeMessages } = require('../../lib/statusCodes');
const Profile = require('./profile.schema');

const findUser = async (req, res) => {
	try {
		const { searchString } = req.query;
		if (!searchString) throw new ValidationError();

		const { user } = res.locals;

		const users = await Profile.find({
			$and: [
				{
					$or: [
						{ firstName: { $regex: `.*${searchString}.*` } },
						{ lastName: { $regex: `.*${searchString}.*` } },
					],
				},
				{ user: { $ne: user } },
			],
		});

		res.status(statusCodes.SUCCESS).json(users);
	} catch (error) {
		res
			.status(statusCodes.BAD_REQUEST)
			.send({ err: statusCodeMessages.BAD_REQUEST });
	}
};

const getUserId = async (req, res) => {
	res.status(statusCodes.SUCCESS).json({ id: res.locals.user });
};

const userOnline = async (req, res) => {
	try {
		const { user } = res.locals;
		await Profile.updateOne({ user }, { online: true, lastSeen: new Date() });
		res
			.status(statusCodes.CREATED)
			.send({ Success: 'Online and last seen updated' });
	} catch (error) {
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ error: statusCodeMessages.INTERNAL_ERROR });
	}
};

const userDisconnect = async (req, res) => {
	try {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.split(' ')[1]
		) {
			return res
				.status(statusCodes.UNAUTHORIZED)
				.json({ error: statusCodeMessages.UNAUTHORIZED });
		}
		const authToken = req.headers.authorization.split(' ')[1];
		const user = req.body.userId;

		jwt.verify(authToken, process.env.JWT_SECRET);

		await Profile.updateOne(
			{ user },
			{
				lastSeen: new Date(),
				online: false,
			}
		);

		res
			.status(statusCodes.SUCCESS)
			.json({ Success: 'Last Seen and online status updates successfully' });
	} catch (error) {
		res
			.status(statusCodes.BAD_REQUEST)
			.send({ err: statusCodeMessages.BAD_REQUEST });
	}
};

module.exports = {
	findUser,
	getUserId,
	userDisconnect,
	userOnline,
};
