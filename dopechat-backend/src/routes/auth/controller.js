const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { statusCodes, statusCodeMessages } = require('../../lib/statusCodes');
const User = require('../user/schema');
const Profile = require('../user/profile.schema');

dotenv.config();

const { JWT_SECRET } = process.env;
const MAX_AGE = 3600;

const COOKIE_OPTIONS = {
	httpOnly: true,
	maxAge: MAX_AGE * 1000,
	sameSite: 'lax',
};

const COOKIE_NAME = 'JWT_TOKEN';

const signJwt = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: MAX_AGE });

const signup = async (req, res) => {
	const { email, password, firstName, lastName, dob, mobile } = req.body;
	try {
		const user = await User.create({ email, password });

		const profile = new Profile({
			firstName,
			lastName,
			dob,
			mobile,
			user: user._id,
		});

		const randomNumber = Math.round(Math.random() * 500);
		profile.avatar = `https://avatars.dicebear.com/4.5/api/avataaars/${randomNumber}.svg`;
		await profile.save();

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: profile.user },
			{
				profile: profile._id,
			}
		);

		const token = signJwt(user._id);
		res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
		res.status(statusCodes.CREATED).json(updatedUser);
	} catch (error) {
		res.status(statusCodes.CONFLICT).send({ err: statusCodeMessages.CONFLICT });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.authenticate(email, password);
	if (!user)
		return res
			.status(statusCodes.UNAUTHORIZED)
			.send({ err: statusCodeMessages.UNAUTHORIZED });
	const token = signJwt(user._id);
	res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
	res.status(statusCodes.CREATED).json(user);
};

const logout = async (req, res) => {
	const { user } = res.locals;
	await Profile.updateOne({ user }, { online: false, lastSeen: Date.now() });
	res.cookie(COOKIE_NAME, '', {
		...COOKIE_OPTIONS,
		maxAge: 1,
	});
	res.status(statusCodes.SUCCESS).send({ msg: 'Logged out' });
};

module.exports = {
	signup,
	login,
	logout,
};
