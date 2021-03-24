const eventNames = require('./eventNames');
const emitter = require('../utils/emitter');

const typingEventsHandler = (io, socket, subscriber, publisher) => {
	const typingEmitter = emitter.bind({ socket, io });

	const typing = (chatRoomId) => {
		console.log(' typing listener');
		const action = {
			type: eventNames.TYPING,
			payload: {
				id: socket.id,
			},
		};
		publisher.publish(chatRoomId, JSON.stringify(action));
	};

	const handler = (channel, { type, payload }) => {
		console.log(type, 'TYING EMITTER');
		typingEmitter(
			payload.id,
			{ chatRoomId: channel },
			{ channel, eventName: type }
		);
	};

	const doneTyping = (chatRoomId) => {
		console.log('done typing listener');
		const action = {
			type: eventNames.DONE_TYPING,
			payload: {
				id: socket.id,
			},
		};
		publisher.publish(chatRoomId, JSON.stringify(action));
	};

	subscriber.on('message', (channel, message) => {
		const { type, payload } = JSON.parse(message);
		switch (type) {
			case eventNames.TYPING:
			case eventNames.DONE_TYPING:
				handler(channel, { type, payload });
				break;
		}
	});

	socket.on(eventNames.TYPING, typing);
	socket.on(eventNames.DONE_TYPING, doneTyping);
};

module.exports = typingEventsHandler;
