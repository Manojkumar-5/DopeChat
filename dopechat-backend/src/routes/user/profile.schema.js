const mongoose = require('mongoose');
const validator = require('validator');

const profileSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	firstName: {
		type: mongoose.Schema.Types.String,
		required: true,
		lowercase: true,
		trim: true,
		get: (v) => v[0].toUpperCase() + v.slice(1),
		validate: {
			validator: (v) => !validator.isEmpty(v),
			message: 'First name cannot be empty',
		},
	},
	lastName: {
		type: mongoose.Schema.Types.String,
		required: true,
		lowercase: true,
		trim: true,
		get: (v) => v[0].toUpperCase() + v.slice(1),
		validate: {
			validator: (v) => !validator.isEmpty(v),
			message: 'Last name cannot be empty',
		},
	},
	dob: {
		type: mongoose.Schema.Types.Date,
		required: true,
		validate: {
			validator: (v) => validator.isDate(v),
			message: () => 'Invalid date',
		},
	},
	mobile: {
		type: mongoose.Schema.Types.String,
		required: true,
		validate: {
			validator: (v) => v.length === 10,
			message: () => 'Mobile number should have exactly 10 digits',
		},
	},
	avatar: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
	lastSeen: {
		type: mongoose.Schema.Types.Date,
		required: true,
		validate: {
			validator: (v) => validator.isDate(v),
			message: () => 'Invalid date',
		},
		default: Date.now(),
	},
	online: {
		type: mongoose.Schema.Types.Boolean,
		required: true,
		default: true,
	},
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
