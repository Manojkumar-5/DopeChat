/* eslint-disable no-param-reassign */
const axios = require('axios');
const eventNames = require('./eventNames');
const emitter = require('../utils/emitter');

const API_TOKEN =
	'eyJhbGciOiJIUzI1NiJ9.RHVtbXk.3UaKDlGI7j1xJObVH4TSAxO31rPCP3DBFEorIHnHhKo';

const axiosRequest = axios.create({
	baseURL: 'http://localhost:5000',
	headers: {
		authorization: `Bearer ${API_TOKEN}`,
	},
});

const joinEventsHandler = (io, socket, subscriber, publisher) => {
	const joinEmitter = emitter.bind({ socket, io });

	const joinAllRooms = (roomIds, userId) => {
		const serverTime = new Date();
		console.log(`${socket.id} joining all rooms. UserId: ${userId}`);
		socket.userId = userId;
		if (!io.clientSocketRooms) io.clientSocketRooms = {};
		io.clientSocketRooms[userId] = {
			socket,
			chatRooms: roomIds,
		};
		socket.join(roomIds);
		// console.log(io.clientSocketRooms);
		const action = {
			type: eventNames.MESSAGES_DELIVERED,
			payload: {
				id: socket.id,
				serverTime,
			},
		};
		const secondaryAction = {
			type: eventNames.USER_ONLINE,
			payload: {
				id: socket.id,
			},
		};
		roomIds.forEach((room) => {
			subscriber.subscribe(room);
			publisher.publish(room, JSON.stringify(action));
			publisher.publish(room, JSON.stringify(secondaryAction));
		});
		subscriber.subscribe(eventNames.JOIN_NEW_ROOM);
	};

	const joinNewRoom = ({ id, roomObject }) => {
		const { _id, user1, user2 } = roomObject;
		let joined = false;
		if (
			io.clientSocketRooms[user1] &&
			io.clientSocketRooms[user1].socket.id === socket.id
		) {
			joined = true;
			io.clientSocketRooms[user1].chatRooms.push(_id);
		} else if (
			io.clientSocketRooms[user2] &&
			io.clientSocketRooms[user2].socket.id === socket.id
		) {
			joined = true;
			io.clientSocketRooms[user2].chatRooms.push(_id);
		}
		if (joined) {
			console.log(`${socket.id} joining room ${_id}`);
			socket.join(_id);
			subscriber.subscribe(_id);
			if (socket.id !== id) io.to(socket.id).emit(eventNames.JOIN_NEW_ROOM);
		}
	};

	const joinNewRoomSocketHandler = (roomObject) => {
		console.log(`Join new room request from ${socket.id}`);
		const action = {
			type: eventNames.JOIN_NEW_ROOM,
			payload: {
				id: socket.id,
				roomObject,
			},
		};
		publisher.publish(eventNames.JOIN_NEW_ROOM, JSON.stringify(action));
	};

	const logoutHandler = () => {
		console.log(`${socket.id} disconnected`);
		socket.disconnect();
		const { userId } = socket;
		const roomIds = io.clientSocketRooms[userId].chatRooms;

		io.clientSockets.delete(socket.id);
		delete io.clientSocketRooms[userId];

		const action = {
			type: eventNames.USER_OFFLINE,
			payload: {
				id: socket.id,
			},
		};

		roomIds.forEach((room) => {
			publisher.publish(room, JSON.stringify(action));
		});

		// console.log(io.clientSockets);
		// console.log(io.clientSocketRooms);

		subscriber.quit();
		publisher.quit();
	};

	const disconnectHandler = (reason) => {
		console.log(`Disconnect fired because ${reason}`);
		if (
			reason.trim() === 'transport close' ||
			reason.trim() === 'ping timeout'
		) {
			logoutHandler();

			const { userId } = socket;
			axiosRequest.post('/user/disconnect', {
				userId,
			});
		}
	};

	const userOffline = (channel, { type, payload }) => {
		console.log(payload);
		joinEmitter(
			payload.id,
			{ chatRoomId: channel },
			{ channel, eventName: type }
		);
	};

	subscriber.on('message', (channel, message) => {
		const { type, payload } = JSON.parse(message);
		switch (type) {
			case eventNames.JOIN_NEW_ROOM:
				joinNewRoom(payload);
				break;
			case eventNames.USER_OFFLINE:
			case eventNames.LOGOUT:
				userOffline(channel, { type, payload });
				break;
		}
	});

	socket.on(eventNames.JOIN_ALL_ROOMS, joinAllRooms);
	socket.on(eventNames.JOIN_NEW_ROOM, joinNewRoomSocketHandler);
	socket.on(eventNames.LOGOUT, logoutHandler);
	socket.on('disconnect', disconnectHandler);
};

module.exports = joinEventsHandler;
