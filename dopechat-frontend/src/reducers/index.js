import { combineReducers } from 'redux';

import user from './user';
import chatList from './chatMenu';
import currentChat from './currentChat';
import socket from './socket';
import userList from './userList';
import chatMessages from './chatMessage';

export default combineReducers({
  user,
  chatMessages,
  chatList,
  currentChat,
  socket,
  userList,
});
