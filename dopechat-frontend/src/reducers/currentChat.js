import CONSTANTS from '../utils/constants';

const initialState = null;

const CurrentChatReducer = (currentChat = initialState, { type, payload }) => {
  switch (type) {
    case CONSTANTS.UPDATE_CURRENT_CHAT:
      return payload;
    case CONSTANTS.LOGOUT:
      return initialState;
    default:
      return currentChat;
  }
};

export default CurrentChatReducer;
