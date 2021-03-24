import CONSTANTS from '../utils/constants';

const initialState = null;

const socketReducer = (socket = initialState, { type, payload }) => {
  if (type === CONSTANTS.SET_SOCKET) return payload;
  return socket;
};

export default socketReducer;
