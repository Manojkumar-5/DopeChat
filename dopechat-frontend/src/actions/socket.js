import CONSTANTS from '../utils/constants';
import { getChatList, getUnreadMessagesForChatRoom } from './chat';
import { fetchEvents } from './event';
import { updateSeenDeliveredApi } from '../api/index';

export const setSocket = (socket) => ({
  type: CONSTANTS.SET_SOCKET,
  payload: socket,
});

export const joinAllRoomsEmitter = () => (dispatch, getState) => {
  const { chatList, socket } = getState();
  const { userId } = getState().user;

  // console.log(socket);
  const roomIds = chatList.map((chat) => chat._id);
  socket.emit(CONSTANTS.JOIN_ALL_ROOMS, roomIds, userId);
};

export const userOnlineListener = (payload) => ({
  type: CONSTANTS.UPDATE_USER_ONLINE_STATUS,
  payload,
});

export const joinNewRoomListener = () => (dispatch) => {
  dispatch(getChatList());
};

export const logoutSocketEmitter = () => (dispatch, getState) => {
  const { socket } = getState();
  socket.emit(CONSTANTS.LOGOUT);
  socket.disconnect();
};

export const userOfflineListener = (payload) => {
  // console.log('OFFLINE LISTENER CALLED');
  return {
    type: CONSTANTS.UPDATE_USER_OFFLINE_STATUS,
    payload,
  };
};

export const typingEmitter = () => (dispatch, getState) => {
  console.log('TYPING EMITTED');
  const { socket, currentChat } = getState();
  socket.emit(CONSTANTS.TYPING, currentChat);
};

export const doneTypingEmitter = () => (dispatch, getState) => {
  console.log('DONE TYPING EMITTED');
  const { socket, currentChat } = getState();
  socket.emit(CONSTANTS.DONE_TYPING, currentChat);
};

export const typingListener = (payload) => {
  console.log('TYPING LISTENING');
  return {
    type: CONSTANTS.TYPING,
    payload,
  };
};

export const doneTypingListener = (payload) => ({
  type: CONSTANTS.DONE_TYPING,
  payload,
});

export const messagesDeliveredListener = (payload) => ({
  type: CONSTANTS.MESSAGES_DELIVERED,
  payload,
});

export const messagesSeenEmitter = (serverTime) => (dispatch, getState) => {
  console.log('message seen emitter');
  const { socket, currentChat } = getState();
  socket.emit(CONSTANTS.MESSAGE_SEEN, currentChat, serverTime);
  dispatch({ type: 'EMITTED' });
};

export const messagesSeenListener = (payload) => {
  console.log('message seen listener', payload);
  return {
    type: CONSTANTS.UPDATE_SEEN_TIME,
    payload,
  };
};

export const messageEventEmitter = () => (dispatch, getState) => {
  const { socket, currentChat } = getState();
  socket.emit(CONSTANTS.MESSAGE_EVENTS, currentChat);
  dispatch({ type: 'EMITTED' });
};

export const messagesDeliveredSeenListener = (payload) => {
  console.log('MESSAGES seen delivered listener', payload);
  return {
    type: CONSTANTS.UPDATE_DELIVERED_SEEN_TIME,
    payload,
  };
};

export const messageEventListener = ({ chatRoomId }) => async (
  dispatch,
  getState
) => {
  console.log('New events');
  dispatch(fetchEvents(chatRoomId, false));
  dispatch(getUnreadMessagesForChatRoom(chatRoomId));

  const receivedChatId = chatRoomId;
  const { currentChat, socket } = getState();

  const response = await updateSeenDeliveredApi({
    receivedChatId,
    currentChatId: currentChat,
  });

  socket.emit(
    CONSTANTS.NEW_MESSAGE_DELIVERED_SEEN,
    currentChat,
    receivedChatId,
    response.data.serverTime
  );
};
