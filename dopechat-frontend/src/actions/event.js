import {
  fetchEventListApi,
  createEventApi,
  editDeleteEventApi,
  uploadFileApi,
  updateSeenApi,
} from '../api';
import { messageEventEmitter, messagesSeenEmitter } from './socket';
import CONSTANTS from '../utils/constants';

export const fetchEvents = (chatRecordId, isScrolled) => async (
  dispatch,
  getState
) => {
  const { chatMessages, user, currentChat } = getState();

  const currentRoomMsgs = chatMessages.find(
    (chat) => chat._id === chatRecordId
  );
  console.log('Fetching events');
  console.log(currentRoomMsgs);

  let data = { chatRecordId };
  // const type = CONSTANTS.LOAD_MESSAGES;

  if (currentRoomMsgs) {
    // type = CONSTANTS.NEW_EVENTS;
    const { eventListLength, firstMessageNumber } = currentRoomMsgs;
    if (firstMessageNumber && firstMessageNumber === 1 && isScrolled) {
      dispatch({
        type: '',
      });
      return false;
    }
    if (firstMessageNumber > 0) data = { ...data, firstMessageNumber };
    // console.log(firstMessageNumber)
    if (!isScrolled && eventListLength > 0) data = { ...data, eventListLength };
  }

  const response = await fetchEventListApi(data);
  // console.log(response.data,"DATA");
  dispatch({
    type: CONSTANTS.LOAD_MESSAGES,
    payload: {
      events: response.data.events,
      chatRecordId,
      userId: user.userId,
      currentChat,
    },
  });
  return true;
};

export const createEvent = (chatRecordId, message, isFile) => async (
  dispatch
) => {
  const response = await createEventApi({ chatRecordId, message, isFile });
  // console.log(response.data);
  dispatch({
    type: CONSTANTS.NEW_MESSAGE,
    payload: {
      chatRecordId,
      event: response.data.event,
    },
  });
  console.log('Emitting new event');
  dispatch(messageEventEmitter());
};

export const editDeleteEvent = (chatRecordId, messageNumber, message) => async (
  dispatch
) => {
  let response;
  if (message === undefined) {
    response = await editDeleteEventApi({
      chatRecordId,
      messageNumber,
    });
  } else {
    response = await editDeleteEventApi({
      chatRecordId,
      message,
      messageNumber,
    });
  }
  // console.log(response.data);
  console.log('Emitting new event');
  dispatch({
    type: CONSTANTS.NEW_EDIT_DELETE_EVENT,
    payload: {
      chatRecordId,
      event: response.data.event,
    },
  });
  dispatch(messageEventEmitter());
};

export const uploadFile = (chatRecordId, file) => async (dispatch) => {
  const response = await uploadFileApi(file);
  dispatch(createEvent(chatRecordId, response.data, true));
};

export const updateSeenTime = (chatRoomId) => async (dispatch) => {
  const response = await updateSeenApi(chatRoomId);
  dispatch(messagesSeenEmitter(response.data.serverTime));
};

export const updateUnreadOnClick = (chatRoomId) => ({
  type: CONSTANTS.UPDATE_UNREAD_ON_CLICK,
  payload: {
    chatRoomId,
  },
});
