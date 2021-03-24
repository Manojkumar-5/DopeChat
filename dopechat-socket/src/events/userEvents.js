const eventNames = require('./eventNames');
const emitter = require('../utils/emitter');

const userEventsHandler = (io, socket, subscriber) => {
	const userEmitter = emitter.bind({ socket, io });

	const userOnlineOffline = (channel, { type, payload }) => {
		// console.log(`Socket: ${socket.id} ${type}`);
		userEmitter(
			payload.id,
			{ chatRoomId: channel },
			{ channel, eventName: type }
		);
	};

	subscriber.on('message', (channel, message) => {
		const { type, payload } = JSON.parse(message);
		switch (type) {
			case eventNames.USER_OFFLINE:
			case eventNames.USER_ONLINE:
				userOnlineOffline(channel, { type, payload });
				break;
		}
	});
};

module.exports = userEventsHandler;
