const redis = require('redis');
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
	cors: {
		origin: '*',
	},
});

const joinEventsHandler = require('./events/joinEvents');
const userEventsHandler = require('./events/userEvents');
const typingEventsHandler = require('./events/typingEvents');
const messageEventsHandler = require('./events/messageEvents');

const onConnection = (socket) => {
	if (!io.clientSockets) io.clientSockets = new Set();
	io.clientSockets.add(socket.id);

	console.log('New connection');
	console.log(socket.id);

	const subscriber = redis.createClient();
	const publisher = redis.createClient();
	joinEventsHandler(io, socket, subscriber, publisher);
	userEventsHandler(io, socket, subscriber, publisher);
	typingEventsHandler(io, socket, subscriber, publisher);
	messageEventsHandler(io, socket, subscriber, publisher);
};

io.on('connection', onConnection);

httpServer.listen(8080, () => {
	console.log('Server running');
});
