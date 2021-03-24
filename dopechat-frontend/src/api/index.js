import axios from 'axios';

const axiosRequest = axios.create({
  baseURL: 'https://19f5926924e6.ngrok.io',
  withCredentials: true,
});

export const loginApi = ({ email, password }) =>
  axiosRequest.post('auth/login', { email, password });

export const logoutApi = () => axiosRequest.post('auth/logout', {});

export const signupApi = ({
  email,
  password,
  firstName,
  lastName,
  dob,
  mobile,
}) =>
  axiosRequest.post('auth/signup', {
    email,
    password,
    firstName,
    lastName,
    dob,
    mobile,
  });

export const getUserIdApi = () => axiosRequest.get('user/id');

export const updateOnlineStatusApi = () => axiosRequest.patch('user/online');

export const getUserListApi = (searchString) =>
  axiosRequest.get('user/match', {
    params: { searchString },
  });

export const getChatListApi = () => axiosRequest.get('chat/list');

export const createChatRecordApi = (receiverId) =>
  axiosRequest.post('chat/create', {
    receiverId,
  });

export const getUnreadMessagesForChatRoomApi = ({ chatRecordId }) =>
  axiosRequest.get('chat/unread', {
    params: {
      chatRecordId,
    },
  });

export const createEventApi = ({ chatRecordId, message, isFile }) =>
  axiosRequest.post('/event/create', { chatRecordId, message, isFile });

export const editDeleteEventApi = ({ chatRecordId, message, messageNumber }) =>
  axiosRequest.post('/event/edit', { chatRecordId, message, messageNumber });

export const fetchEventListApi = ({
  chatRecordId,
  eventListLength,
  firstMessageNumber,
}) =>
  axiosRequest.get('/event/list', {
    params: {
      chatRecordId,
      eventListLength,
      firstMessageNumber,
    },
  });

export const uploadFileApi = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosRequest.post('/event/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateSeenDeliveredApi = ({ receivedChatId, currentChatId }) =>
  axiosRequest.patch('/timestamp/update', { receivedChatId, currentChatId });

export const updateSeenApi = (chatRecordId) =>
  axiosRequest.patch('/timestamp/update/seen', { chatRecordId });
