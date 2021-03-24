const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	email: {
		type: mongoose.Schema.Types.String,
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: (v) => validator.isEmail(v),
			message: () => 'Invalid email',
		},
	},
	password: {
		type: mongoose.Schema.Types.String,
		required: true,
		trim: true,
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'Profile',
	},
});

userSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

userSchema.statics.authenticate = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) return null;
	const authenticated = await bcrypt.compare(password, user.password);
	if (authenticated) return user;
	return null;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
