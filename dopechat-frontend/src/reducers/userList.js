import CONSTANTS from '../utils/constants';

const initialState = {
  loading: false,
  results: [],
  value: '',
};

const UserListReducer = (userList = initialState, { type, payload }) => {
  switch (type) {
    case CONSTANTS.START_TYPING_SEARCH_STRING:
      return {
        ...userList,
        value: payload.query,
      };
    case CONSTANTS.START_SEARCHING_MATCHING_USERS:
      return { ...userList, loading: true };
    case CONSTANTS.FETCHED_USERS_WITH_MATCHING_NAME:
      return { ...userList, loading: false, results: payload.results };
    case CONSTANTS.CLICK_USER_FROM_LIST:
    case CONSTANTS.CLOSED_SEARCH_MODEL:
    case CONSTANTS.LOGOUT:
      return initialState;
    default:
      return userList;
  }
};

export default UserListReducer;
