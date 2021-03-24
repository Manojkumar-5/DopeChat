const eventNames = require('./eventNames');
const emitter = require('../utils/emitter');

const messageEventsHandler = (io, socket, subscriber, publisher) => {
	const messageEmitter = emitter.bind({ socket, io });

	const messageEvents = (chatRoomId) => {
		console.log('MESSAGE Listen FROM', socket.id, `to ${chatRoomId}`);
		const action = {
			type: eventNames.MESSAGE_EVENTS,
			payload: {
				id: socket.id,
			},
		};
		publisher.publish(chatRoomId, JSON.stringify(action));
	};

	const messageEventsEmitter = (channel, { type, payload }) => {
		console.log('MESSAGE Emitted FROM', socket.id, `to ${channel} ${type}`);
		messageEmitter(
			payload.id,
			{ chatRoomId: channel },
			{ channel, eventName: type }
		);
	};

	const messageSeen = (chatRoomId, seenTime) => {
		// console.log('MESSAGE SEEN LISTENER');
		const action = {
			type: eventNames.MESSAGE_SEEN,
			payload: {
				id: socket.id,
				seenTime,
			},
		};
		publisher.publish(chatRoomId, JSON.stringify(action));
	};

	const messageSeenEmitter = (channel, { type, payload }) => {
		// console.log('MESSAGE SEEN EMITTER');
		messageEmitter(
			payload.id,
			{ chatRoomId: channel, seenTime: payload.seenTime },
			{ channel, eventName: type }
		);
	};

	const messageSeenDelivered = (
		currentChatRoomId,
		receiverChatRoomId,
		serverTime
	) => {
		console.log('SEEN DELIVERED LISTENER', serverTime);
		const action = {
			type: eventNames.NEW_MESSAGE_DELIVERED_SEEN,
			payload: {
				id: socket.id,
				serverTime,
				currentChatRoomId,
				receiverChatRoomId,
			},
		};
		publisher.publish(receiverChatRoomId, JSON.stringify(action));
	};

	const messageSeenDeliveredEmitter = (channel, { type, payload }) => {
		console.log('SEEN DELIVERED EMITTER');
		const isSeen = payload.currentChatRoomId === payload.receiverChatRoomId;
		messageEmitter(
			payload.id,
			{ chatRoomId: channel, serverTime: payload.serverTime, isSeen },
			{ channel, eventName: type }
		);
	};

	const messageDeliveredEmitter = (channel, { type, payload }) => {
		// console.log('DELIVERED LISTENER');
		messageEmitter(
			payload.id,
			{ chatRoomId: channel, serverTime: payload.serverTime },
			{ channel, eventName: type }
		);
	};

	subscriber.on('message', (channel, message) => {
		const { type, payload } = JSON.parse(message);
		switch (type) {
			case eventNames.MESSAGE_EVENTS:
				messageEventsEmitter(channel, { type, payload });
				break;
			case eventNames.MESSAGE_SEEN:
				messageSeenEmitter(channel, { type, payload });
				break;
			case eventNames.NEW_MESSAGE_DELIVERED_SEEN:
				messageSeenDeliveredEmitter(channel, { type, payload });
				break;
			case eventNames.MESSAGES_DELIVERED:
				messageDeliveredEmitter(channel, { type, payload });
				break;
		}
	});

	socket.on(eventNames.MESSAGE_EVENTS, messageEvents);
	socket.on(eventNames.MESSAGE_SEEN, messageSeen);
	socket.on(eventNames.NEW_MESSAGE_DELIVERED_SEEN, messageSeenDelivered);
};

module.exports = messageEventsHandler;
