/* eslint-disable prefer-promise-reject-errors */
const mongoose = require('mongoose');
const { Storage } = require('@google-cloud/storage');
const { statusCodes, statusCodeMessages } = require('../../lib/statusCodes');
const ChatRoom = require('../chat/schema');
const Event = require('./schema');
const pastDate = require('../../lib/pastDate');

const storage = new Storage({
	projectId: 'dopechat-f0e8b',
	keyFilename: './secretKey.json',
});

const bucket = storage.bucket('dopechat-f0e8b.appspot.com');

const POPULATE_OBJECT = {
	path: 'sender',
	select: '-email -password',
	populate: {
		path: 'profile',
		select: 'firstName lastName avatar',
	},
};

const createEvent = async ({
	chatRecordId,
	currentUser,
	eventType,
	messageNumber,
	isFile,
	message,
	seenTime = pastDate,
	sentTime = new Date(),
	receivedTime = pastDate,
}) => {
	try {
		const chatRoomObject = await ChatRoom.findById(chatRecordId);

		let receiver;

		if (chatRoomObject.user1.toString() === currentUser)
			receiver = chatRoomObject.user2;
		else receiver = chatRoomObject.user1;

		const event = Event.findOneAndUpdate(
			{
				chatRoom: chatRecordId,
				sender: currentUser,
				receiver,
				eventType,
				messageContent: message,
				messageNumber,
				isFile,
				sentTime,
				seenTime,
				receivedTime,
			},
			{},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

		return event;
	} catch (error) {
		console.log(error);
	}
};

const createNewMessageEvent = async (req, res) => {
	try {
		const { chatRecordId, message, isFile } = req.body;
		if (!mongoose.isValidObjectId(chatRecordId))
			return res
				.status(statusCodes.BAD_REQUEST)
				.send(statusCodeMessages.INVALID_OBJECT_ID);
		const currentUser = res.locals.user;

		const lastMessage = await Event.find({
			chatRoom: chatRecordId,
			eventType: 'CREATE',
		})
			.sort({ messageNumber: -1 })
			.limit(1);

		let messageNumber;
		if (lastMessage.length === 0) messageNumber = 1;
		else messageNumber = lastMessage[0].messageNumber + 1;

		const e1 = await createEvent({
			chatRecordId,
			currentUser,
			eventType: 'CREATE',
			messageNumber,
			message,
			isFile,
		});

		const event = await Event.findById(e1._id).populate(POPULATE_OBJECT);

		res.status(statusCodes.SUCCESS).json({ event });
	} catch (error) {
		console.log(error);
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ err: statusCodeMessages.INTERNAL_ERROR });
	}
};

const editDeleteMessageEvent = async (req, res) => {
	try {
		const { chatRecordId, message, messageNumber } = req.body;
		const createEventMessage = await Event.findOne({
			messageNumber,
			eventType: 'CREATE',
		});

		if (!mongoose.isValidObjectId(chatRecordId) || !createEventMessage)
			return res
				.status(statusCodes.BAD_REQUEST)
				.send(statusCodeMessages.INVALID_OBJECT_ID);

		const { seenTime, receivedTime, sentTime } = createEventMessage;

		const currentUser = res.locals.user;

		let eventType;
		if (message) eventType = 'EDIT';
		else eventType = 'DELETE';

		const e1 = await createEvent({
			chatRecordId,
			currentUser,
			eventType,
			messageNumber,
			message,
			isFile: false,
			sentTime,
			seenTime,
			receivedTime,
		});

		const event = await Event.findById(e1._id).populate(POPULATE_OBJECT);

		res.status(statusCodes.SUCCESS).json({ event });
	} catch (error) {
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ err: statusCodeMessages.INTERNAL_ERROR });
	}
};

const fetchMessageEvents = async (req, res) => {
	try {
		const { chatRecordId, eventListLength, firstMessageNumber } = req.query;
		if (!mongoose.isValidObjectId(chatRecordId))
			return res
				.status(statusCodes.BAD_REQUEST)
				.send(statusCodeMessages.INVALID_OBJECT_ID);

		if (eventListLength === undefined && firstMessageNumber === undefined) {
			const finalEvent = await Event.find({
				chatRoom: chatRecordId,
				eventType: 'CREATE',
			})
				.lean()
				.sort({ messageNumber: -1 })
				.limit(1);

			if (!finalEvent.length)
				return res.status(statusCodes.SUCCESS).send({ events: [] });

			const maxMessageNumber = finalEvent[0].messageNumber;

			const fetchEvents = await Event.find({
				chatRoom: chatRecordId,
				messageNumber: { $gte: maxMessageNumber - 30 },
			})
				.populate(POPULATE_OBJECT)
				.lean();

			res.status(statusCodes.SUCCESS).send({ events: fetchEvents });
		} else if (firstMessageNumber && eventListLength) {
			const fetchEvents = await Event.find({
				chatRoom: chatRecordId,
				messageNumber: {
					$gte: firstMessageNumber,
				},
			})
				.populate(POPULATE_OBJECT)
				.lean()
				.sort({ createdAt: 1 });

			const updatedEvents = fetchEvents.slice(eventListLength);

			res.status(statusCodes.SUCCESS).json({ events: updatedEvents });
		} else if (firstMessageNumber) {
			const fetchEvents = await Event.find({
				chatRoom: chatRecordId,
				messageNumber: {
					$gte: firstMessageNumber - 30,
					$lt: firstMessageNumber,
				},
			})
				.populate(POPULATE_OBJECT)
				.lean();
			res.status(statusCodes.SUCCESS).send({ events: fetchEvents });
		} else
			return res
				.status(statusCodes.BAD_REQUEST)
				.send({ err: statusCodeMessages.BAD_REQUEST });
	} catch (error) {
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ err: statusCodeMessages.INTERNAL_ERROR });
	}
};

const fileUploadEvent = async (req, res) => {
	try {
		console.log('Upload Image');

		const { file } = req;

		if (file) {
			uploadImageToStorage(file)
				.then((url) => {
					res.status(statusCodes.SUCCESS).send(`${url}#@${file.originalname}`);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	} catch (error) {
		res
			.status(statusCodes.INTERNAL_ERROR)
			.send({ err: statusCodeMessages.INTERNAL_ERROR });
	}
};

const uploadImageToStorage = (file) =>
	new Promise((resolve, reject) => {
		if (!file) reject('No image file');
		const newFileName = `${file.originalname}_${Date.now()}`;

		const fileUpload = bucket.file(newFileName);

		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		blobStream.on('error', (error) => {
			console.log(error);
		});

		blobStream.on('finish', () => {
			// The public URL can be used to directly access the file via HTTP.
			const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
			resolve(url);
		});

		blobStream.end(file.buffer);
	});

module.exports = {
	createNewMessageEvent,
	editDeleteMessageEvent,
	fetchMessageEvents,
	fileUploadEvent,
};
