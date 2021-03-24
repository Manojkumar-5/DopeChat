const findChatRoom = (chat, userId) => {
  if (typeof chat.user1 === 'object') {
    if (chat.user1.profile.user === userId) {
      return true;
    }
    if (chat.user2 === userId) {
      return true;
    }
  } else {
    if (chat.user2.profile.user === userId) {
      return true;
    }
    if (chat.user1 === userId) {
      return true;
    }
  }
  return false;
};

export default findChatRoom;
