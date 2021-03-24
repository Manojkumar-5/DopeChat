const mongoose = require('mongoose');
const validator = require('validator');
const pastDate = require('../../lib/pastDate');

const eventSchema = mongoose.Schema(
	{
		chatRoom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChatRoom',
			required: true,
		},
		eventType: {
			type: mongoose.Schema.Types.String,
			enum: ['CREATE', 'EDIT', 'DELETE'],
			required: true,
		},
		messageNumber: {
			type: mongoose.Schema.Types.Number,
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		messageContent: {
			type: mongoose.Schema.Types.String,
			required: false,
			trim: true,
			validate: {
				validator: (v) => !validator.isEmpty(v),
				message: 'Message cannot be empty',
			},
		},
		isFile: {
			type: mongoose.Schema.Types.Boolean,
		},
		sentTime: {
			type: mongoose.Schema.Types.Date,
			required: true,
			default: Date.now,
		},
		seenTime: {
			type: mongoose.Schema.Types.Date,
			required: true,
			default: pastDate,
		},
		receivedTime: {
			type: mongoose.Schema.Types.Date,
			required: true,
			default: pastDate,
		},
	},
	{ timestamps: true }
);

const EventModel = mongoose.model('CrudEvent', eventSchema);

module.exports = EventModel;
