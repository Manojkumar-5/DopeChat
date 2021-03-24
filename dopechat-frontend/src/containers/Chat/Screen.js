import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChatComponent from '../../components/Chat/Screen';
import {
  typingEmitter,
  doneTypingEmitter,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventEmitter,
  messageEventListener,
  messagesDeliveredSeenListener,
} from '../../actions/socket';
import {
  createEvent,
  fetchEvents,
  uploadFile,
  editDeleteEvent,
  updateSeenTime,
  updateUnreadOnClick,
} from '../../actions/event';
import CONSTANTS from '../../utils/constants';

const Screen = ({
  currentChat,
  chatList,
  user,
  socket,
  chatMessages,
  typingEmitter,
  doneTypingEmitter,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventEmitter,
  messageEventListener,
  messagesDeliveredSeenListener,
  createEvent,
  fetchEvents,
  uploadFile,
  editDeleteEvent,
  updateSeenTime,
  updateUnreadOnClick,
}) => {
  const onSubmit = async (text, isFile) => {
    await createEvent(currentChat, text, isFile);
  };

  const onEditDelete = async (message, messageNumber) => {
    await editDeleteEvent(currentChat, messageNumber, message);
  };

  const onFileSubmit = (file) => {
    uploadFile(currentChat, file);
  };

  const onEventSendHandler = (/* messageText, messageType, isFile */) => {
    // api to create/edit/delete event ( depending using messageType )
    // react state update

    messageEventEmitter();
  };

  useEffect(() => {
    // Api to update seen time of messages, returns server time
    fetchEvents(currentChat, false);
    updateSeenTime(currentChat);
    updateUnreadOnClick(currentChat);

    return () => {};
  }, [currentChat]);

  return (
    <ChatComponent
      currentChat={currentChat}
      chatList={chatList}
      user={user}
      typingEmitter={typingEmitter}
      doneTypingEmitter={doneTypingEmitter}
      onEventSendHandler={onEventSendHandler}
      onSubmit={onSubmit}
      chatMessages={chatMessages}
      onFileSubmit={onFileSubmit}
      onEditDelete={onEditDelete}
      fetchEvents={fetchEvents}
    />
  );
};

const mapStateToProps = ({
  user,
  chatList,
  currentChat,
  socket,
  chatMessages,
}) => ({
  user,
  chatList,
  currentChat,
  socket,
  chatMessages,
});

const mapDispatchToProps = {
  typingEmitter,
  doneTypingEmitter,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventEmitter,
  messageEventListener,
  messagesDeliveredSeenListener,
  createEvent,
  fetchEvents,
  uploadFile,
  editDeleteEvent,
  updateSeenTime,
  updateUnreadOnClick,
};

Screen.propTypes = {
  socket: PropTypes.object.isRequired,
  currentChat: PropTypes.string.isRequired,
  chatList: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
  chatMessages: PropTypes.object.isRequired,
  typingEmitter: PropTypes.func.isRequired,
  doneTypingEmitter: PropTypes.func.isRequired,
  doneTypingListener: PropTypes.func.isRequired,
  typingListener: PropTypes.func.isRequired,
  messagesDeliveredListener: PropTypes.func.isRequired,
  messagesSeenListener: PropTypes.func.isRequired,
  messageEventEmitter: PropTypes.func.isRequired,
  messageEventListener: PropTypes.func.isRequired,
  messagesDeliveredSeenListener: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  editDeleteEvent: PropTypes.func.isRequired,
  updateSeenTime: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
