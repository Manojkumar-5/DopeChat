const mongoose = require('mongoose');
const Event = require('../event/schema');
const pastDate = require('../../lib/pastDate');
const { statusCodes, statusCodeMessages } = require('../../lib/statusCodes');

const updateSeen = async (req, res) => {
	const { chatRecordId } = req.body;
	if (!mongoose.isValidObjectId(chatRecordId))
		return res
			.status(statusCodes.BAD_REQUEST)
			.send(statusCodeMessages.INVALID_OBJECT_ID);
	const { user } = res.locals;
	const seenTime = Date.now();
	const updated = await Event.updateMany(
		{ chatRoom: chatRecordId, receiver: user, seenTime: pastDate },
		{ seenTime }
	);
	console.log(
		`Update seen controller updated records number: ${updated.nModified}`
	);
	res.status(200).send({ serverTime: seenTime });
};

const updateSeenDelivered = async (req, res) => {
	const { currentChatId, receivedChatId } = req.body;
	if (
		!receivedChatId ||
		!mongoose.isValidObjectId(receivedChatId) ||
		(currentChatId && !mongoose.isValidObjectId(currentChatId))
	)
		return res
			.status(statusCodes.BAD_REQUEST)
			.send(statusCodeMessages.INVALID_OBJECT_ID);
	const { user } = res.locals;
	const time = Date.now();
	const filter = {
		chatRoom: receivedChatId,
		receiver: user,
		receivedTime: pastDate,
	};
	const updates = {
		receivedTime: time,
	};

	if (currentChatId && currentChatId === receivedChatId)
		updates.seenTime = time;

	const updated = await Event.updateMany(filter, updates);
	console.log(
		`Update seen delivered controller updated records: ${updated.nModified}`
	);
	res.status(200).send({ serverTime: time });
};

module.exports = {
	updateSeen,
	updateSeenDelivered,
};
