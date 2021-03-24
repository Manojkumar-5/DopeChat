import CONSTANTS from '../utils/constants';

const initialState = {
  userId: null,
};

const UserReducer = (user = initialState, { type, payload }) => {
  switch (type) {
    case CONSTANTS.AUTHENTICATED:
      return {
        userId: payload.userId,
      };
    case CONSTANTS.NOT_AUTHENTICATED:
      return {
        userId: null,
      };
    case CONSTANTS.LOGOUT:
      return initialState;
    default:
      return user;
  }
};

export default UserReducer;
