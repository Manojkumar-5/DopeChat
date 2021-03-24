import CONSTANTS from '../utils/constants';

const initialState = [];

const updateStatus = (chat, chatRoomId, status) => {
  if (chat._id === chatRoomId) {
    if (typeof chat.user1 === 'object') {
      chat.user1.profile.online = status;
      if (!status) {
        chat.user1.profile.lastSeen = new Date();
      }
    } else {
      chat.user2.profile.online = status;
      if (!status) {
        chat.user2.profile.lastSeen = new Date();
      }
    }
  }
  return chat;
};

const updateTypingStatus = (chat, chatRoomId, status) => {
  if (chat._id === chatRoomId) {
    if (typeof chat.user1 === 'object') {
      chat.user1.profile.typing = status;
    } else {
      chat.user2.profile.typing = status;
    }
  }
  return chat;
};

const addTyping = (chat) => {
  if (typeof chat.user1 === 'object') {
    chat.user1.profile.typing = false;
  } else {
    chat.user2.profile.typing = false;
  }
  return chat;
};

const updateUnreadOnClick = (chat, chatRoomId) => {
  console.log('MAKING UNREAD ZERO');
  if (chat._id === chatRoomId) {
    chat.unread = 0;
    console.log(chat);
  }
  return chat;
};

const ChatMenuReducer = (chatMenu = initialState, { type, payload }) => {
  switch (type) {
    case CONSTANTS.FETCH_CHATLIST:
      return payload.map((chat) => addTyping(chat));
    case CONSTANTS.UPDATE_UNREAD:
      if (payload.currentChat === payload.chatRecordId) return chatMenu;
      return chatMenu.map((chat) => {
        if (chat._id === payload.chatRecordId) chat.unread = payload.unread;
        return chat;
      });
    case CONSTANTS.UPDATE_USER_ONLINE_STATUS:
      return chatMenu.map((chat) =>
        updateStatus(chat, payload.chatRoomId, true)
      );
    case CONSTANTS.UPDATE_USER_OFFLINE_STATUS:
      return chatMenu.map((chat) =>
        updateStatus(chat, payload.chatRoomId, false)
      );
    case CONSTANTS.TYPING:
      return chatMenu.map((chat) =>
        updateTypingStatus(chat, payload.chatRoomId, true)
      );
    case CONSTANTS.DONE_TYPING:
      return chatMenu.map((chat) =>
        updateTypingStatus(chat, payload.chatRoomId, false)
      );
    case CONSTANTS.UPDATE_UNREAD_ON_CLICK:
      return chatMenu.map((chat) =>
        updateUnreadOnClick(chat, payload.chatRoomId)
      );
    case CONSTANTS.LOGOUT:
      return initialState;
    default:
      return chatMenu;
  }
};

export default ChatMenuReducer;
