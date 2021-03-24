function emitter(eventSocketId, payload, { channel, eventName }) {
	if (eventSocketId === this.socket.id)
		return this.socket.to(channel).emit(eventName, payload);
	if (!this.io.clientSockets.has(eventSocketId)) {
		return this.io.to(channel).emit(eventName, payload);
	}
	return 0;
}

module.exports = emitter;

/*
  event emitter socket gets message.
    1. socket.to.emit //other guy will get it if he is on the same server, else it is lost
  receiver socket gets message
    1. check if emitter is in current server (using set). 
      if he is, that means he has already emitted it to receiver. So do nothing.
      If he is not, then io.to.emit
*/
