const mongoose = require('mongoose');
const { ValidationError } = require('joi');
const { statusCodes, statusCodeMessages } = require('../../lib/statusCodes');
const ChatRoom = require('./schema');
const Event = require('../event/schema');
const pastDate = require('../../lib/pastDate');

const createChatRecord = async (req, res) => {
	try {
		const currentUser = res.locals.user;

		const participant = req.body.receiverId;
		if (!mongoose.isValidObjectId(participant) || currentUser === participant)
			throw new ValidationError();

		const existingRecordCount = await ChatRoom.countDocuments({
			$or: [
				{ user1: currentUser, user2: participant },
				{ user1: participant, user2: currentUser },
			],
		});

		if (existingRecordCount !== 0)
			return res.status(statusCodes.CONFLICT).send('Chatroom already exists');

		const chatRoom = ChatRoom({
			user1: currentUser,
			user2: participant,
		});

		await chatRoom.save();

		res.status(statusCodes.SUCCESS).json(chatRoom);
	} catch (error) {
		console.log(error);
		res
			.status(statusCodes.BAD_REQUEST)
			.send({ err: statusCodeMessages.BAD_REQUEST });
	}
};

const loadChatList = async (req, res) => {
	try {
		const currentUser = res.locals.user;

		const updated = await Event.updateMany(
			{ receiver: currentUser, receivedTime: pastDate },
			{ receivedTime: Date.now() }
		);

		console.log(`Load chat list controller updated: ${updated.nModified}`);

		const user1List = await ChatRoom.find({ user1: currentUser })
			.populate({
				path: 'user2',
				select: '-email -password',
				populate: {
					path: 'profile',
				},
			})
			.lean();

		const user2List = await ChatRoom.find({ user2: currentUser })
			.populate({
				path: 'user1',
				select: '-email -password',
				populate: {
					path: 'profile',
				},
			})
			.lean();

		const chatList = [...user1List, ...user2List];

		let promises = chatList.map((chat) =>
			Event.countDocuments({
				chatRoom: chat._id,
				eventType: 'CREATE',
				seenTime: pastDate,
				receiver: currentUser,
			})
		);

		promises = await Promise.all(promises);

		promises.forEach((unread, index) => {
			chatList[index].unread = unread;
		});

		return res.status(statusCodes.SUCCESS).send({ chatList });
	} catch (error) {
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ err: statusCodeMessages.INTERNAL_ERROR });
	}
};

const getUnreadMessagesForChatRoom = async (req, res) => {
	try {
		const { user } = res.locals;
		const { chatRecordId } = req.query;
		if (!mongoose.isValidObjectId(chatRecordId))
			res
				.status(statusCodes.BAD_REQUEST)
				.send({ error: statusCodeMessages.INVALID_OBJECT_ID });
		const unread = await Event.countDocuments({
			chatRoom: chatRecordId,
			eventType: 'CREATE',
			seenTime: pastDate,
			receiver: user,
		});
		return res.status(statusCodes.SUCCESS).send({ unread });
	} catch (error) {
		return res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ error: statusCodeMessages.INTERNAL_ERROR });
	}
};

module.exports = {
	createChatRecord,
	loadChatList,
	getUnreadMessagesForChatRoom,
};
