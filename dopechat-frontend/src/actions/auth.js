import { loginApi, logoutApi, signupApi } from '../api/index';
import CONSTANTS from '../utils/constants';
import { getUserId } from './user';

export const login = ({ email, password }) => async (dispatch) => {
  try {
    await loginApi({ email, password });
    dispatch(getUserId());
  } catch (e) {
    dispatch({
      type: CONSTANTS.NOT_AUTHENTICATED,
    });
    return {
      ERROR: 'Please Check Email/Password Entered',
    };
  }
};

export const signup = ({
  email,
  password,
  firstName,
  lastName,
  dob,
  mobile,
}) => async (dispatch) => {
  try {
    await signupApi({
      email,
      password,
      firstName,
      lastName,
      dob,
      mobile,
    });
    dispatch(getUserId());
  } catch (e) {
    dispatch({
      type: CONSTANTS.NOT_AUTHENTICATED,
    });
    if (e.response.status === 409) {
      return {
        ERROR: 'User With That Email Address Already Exists',
      };
    }
    return {
      ERROR: 'Please Check The Details You Have Entered',
    };
  }
};

export const logout = () => async (dispatch) => {
  try {
    await logoutApi();
    dispatch({
      type: CONSTANTS.LOGOUT,
    });
  } catch (e) {
    return {
      ERROR: 'Could not Logout',
    };
  }
};
