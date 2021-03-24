import { getUserIdApi, getUserListApi } from '../api/index';
import CONSTANTS from '../utils/constants';

export const getUserId = () => async (dispatch) => {
  try {
    const response = await getUserIdApi();
    dispatch({
      type: CONSTANTS.AUTHENTICATED,
      payload: {
        userId: response.data.id,
      },
    });
  } catch (e) {
    dispatch({
      type: CONSTANTS.NOT_AUTHENTICATED,
    });
  }
};

export const getUserList = (searchString) => async (dispatch) => {
  try {
    const response = await getUserListApi(searchString);
    setTimeout(() => {
      dispatch({
        type: CONSTANTS.FETCHED_USERS_WITH_MATCHING_NAME,
        payload: {
          results: response.data,
        },
      });
    }, 500);
  } catch (e) {
    dispatch({
      type: CONSTANTS.FETCHED_USERS_WITH_MATCHING_NAME,
      payload: {
        results: [],
      },
    });
  }
};

export const startTypingSearchString = (query) => ({
  type: CONSTANTS.START_TYPING_SEARCH_STRING,
  payload: {
    query,
  },
});

export const startSearching = () => ({
  type: CONSTANTS.START_SEARCHING_MATCHING_USERS,
});

export const selectUser = () => ({
  type: CONSTANTS.CLICK_USER_FROM_LIST,
});

export const closeSearchModel = () => ({
  type: CONSTANTS.CLOSED_SEARCH_MODEL,
});
