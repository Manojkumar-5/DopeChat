import {
  getChatListApi,
  createChatRecordApi,
  getUnreadMessagesForChatRoomApi,
} from '../api/index';
import CONSTANTS from '../utils/constants';

const fetchChatList = (dispatch, response) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: CONSTANTS.FETCH_CHATLIST,
      payload: response.data.chatList,
    });
    resolve();
  });

export const getChatList = () => async (dispatch) => {
  try {
    const response = await getChatListApi();
    fetchChatList(dispatch, response).then(() => {});
  } catch (e) {
    return {
      ERROR: 'Error Fetching Chatlist',
    };
  }
};

export const getUnreadMessagesForChatRoom = (chatRecordId) => async (
  dispatch,
  getState
) => {
  try {
    const { currentChat } = getState();
    const response = await getUnreadMessagesForChatRoomApi({ chatRecordId });
    dispatch({
      type: CONSTANTS.UPDATE_UNREAD,
      payload: {
        unread: response.data.unread,
        chatRecordId,
        currentChat,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCurrentChat = (chatId) => ({
  type: CONSTANTS.UPDATE_CURRENT_CHAT,
  payload: chatId,
});

export const createChatRecord = (receiverId) => async (dispatch, getState) => {
  try {
    const response = await createChatRecordApi(receiverId);
    dispatch(getChatList());
    const { socket } = getState();
    socket.emit(CONSTANTS.JOIN_NEW_ROOM, response.data);
  } catch (e) {
    if (e.response.status === 409) {
      return {
        CONFLICT: 'ChatRoom already Already exists',
        id: receiverId,
      };
    }
    return {
      ERROR: 'Error Creating New Chat',
    };
  }
};
