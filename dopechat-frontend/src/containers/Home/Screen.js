import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Home from '../../components/Home/Screen';
import { logout } from '../../actions/auth';
import { getChatList } from '../../actions/chat';
import PreLoader from '../../components/common/PreLoader';
import { joinAllRoomsEmitter, logoutSocketEmitter } from '../../actions/socket';
import { updateOnlineStatusApi } from '../../api';

const Screen = ({
  logout,
  getChatList,
  currentChat,
  joinAllRoomsEmitter,
  logoutSocketEmitter,
  socket,
}) => {
  const getChatListRef = useRef(getChatList);
  const joinAllRoomsEmitterRef = useRef(joinAllRoomsEmitter);
  const socketRef = useRef(socket);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // useEffect hack for async functions
    const asyncFunc = async () => {
      await updateOnlineStatusApi();
      await getChatListRef.current();
      joinAllRoomsEmitterRef.current();
      setIsLoading(false);
    };

    socketRef.current.connect();
    asyncFunc();
  }, []);

  const logouthandler = async (e) => {
    e.preventDefault();
    await logout();
    logoutSocketEmitter();
  };

  return !isLoading ? (
    <Home logouthandler={logouthandler} currentChat={currentChat} />
  ) : (
    <PreLoader size="massive" full />
  );
};

const mapStateToProps = ({ currentChat, user, socket }) => ({
  currentChat,
  user,
  socket,
});

const mapDispatchToProps = {
  logout,
  getChatList,
  joinAllRoomsEmitter,
  logoutSocketEmitter,
};

Screen.propTypes = {
  logout: PropTypes.func.isRequired,
  getChatList: PropTypes.func.isRequired,
  currentChat: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
  joinAllRoomsEmitter: PropTypes.func.isRequired,
  logoutSocketEmitter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
