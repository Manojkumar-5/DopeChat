const mongoose = require('mongoose');

const chatRoomSchema = mongoose.Schema({
	user1: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	user2: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
