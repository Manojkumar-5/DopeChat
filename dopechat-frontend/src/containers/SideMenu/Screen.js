import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SideMenuComponent from '../../components/SideMenu/Screen';
import CONSTANTS from '../../utils/constants';

import {
  getChatList,
  updateCurrentChat,
  createChatRecord,
} from '../../actions/chat';
import {
  getUserList,
  startSearching,
  startTypingSearchString,
  selectUser,
  closeSearchModel,
} from '../../actions/user';
import findChatRoom from '../../utils/findChatRoom';
import {
  userOnlineListener,
  joinNewRoomListener,
  userOfflineListener,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventListener,
  messagesDeliveredSeenListener,
} from '../../actions/socket';

const Screen = ({
  getUserList,
  user,
  chatList,
  currentChat,
  updateCurrentChat,
  userList,
  startSearching,
  startTypingSearchString,
  selectUser,
  createChatRecord,
  closeSearchModel,
  socket,
  userOnlineListener,
  joinNewRoomListener,
  userOfflineListener,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventListener,
  messagesDeliveredSeenListener,
}) => {
  useEffect(() => {
    console.log('SOCKET LISTENING TO EVENTS');
    socket.on(CONSTANTS.USER_ONLINE, userOnlineListener);
    socket.on(CONSTANTS.JOIN_NEW_ROOM, joinNewRoomListener);
    socket.on(CONSTANTS.USER_OFFLINE, userOfflineListener);
    socket.on(CONSTANTS.TYPING, typingListener);
    socket.on(CONSTANTS.DONE_TYPING, doneTypingListener);
    socket.on(CONSTANTS.MESSAGES_DELIVERED, messagesDeliveredListener);
    socket.on(CONSTANTS.MESSAGE_SEEN, messagesSeenListener);
    socket.on(CONSTANTS.MESSAGE_EVENTS, messageEventListener);
    socket.on(
      CONSTANTS.NEW_MESSAGE_DELIVERED_SEEN,
      messagesDeliveredSeenListener
    );
  }, []);

  const [searchModalIsOpen, setSearchModalIsOpen] = useState(false);

  const [createChatMessage, setCreateChatMessage] = useState({
    type: '',
    message: '',
  });

  const [timerForSearch, setTimerForSearch] = useState(null);

  const startSearchingRef = useRef(startSearching);
  const getUserListRef = useRef(getUserList);

  const clearCreateChatMessage = () => {
    setCreateChatMessage({
      type: '',
      message: '',
    });
  };

  const toggleSearchModal = () => {
    closeSearchModel();
    setSearchModalIsOpen(!searchModalIsOpen);
    clearCreateChatMessage();
  };

  const handleClick = (chatId) => {
    updateCurrentChat(chatId);
  };

  const selectUserFromList = async (e, { result }) => {
    const response = await createChatRecord(result.user);
    selectUser();

    if (response && response.CONFLICT) {
      const chatId = chatList.find((chat) => findChatRoom(chat, response.id));
      toggleSearchModal();
      clearCreateChatMessage();
      updateCurrentChat(chatId._id);
      return;
    }
    if (response && response.ERROR) {
      setCreateChatMessage({
        type: 'negative',
        message: response.ERROR,
      });
    } else {
      setCreateChatMessage({
        type: 'positive',
        message: 'Successfully Created New ChatRoom',
      });
    }

    setTimeout(() => {
      clearCreateChatMessage();
    }, 1500);
  };

  const onSearchChange = (e, { value }) => {
    startTypingSearchString(value);
  };

  useEffect(() => {
    if (timerForSearch) {
      clearTimeout(timerForSearch);
    }

    if (userList.value) {
      setTimerForSearch(
        setTimeout(() => {
          startSearchingRef.current();
          getUserListRef.current(userList.value);
        }, 500)
      );
    }
    return () => {
      clearTimeout(timerForSearch);
    };
  }, [userList.value]);

  return (
    <SideMenuComponent
      user={user}
      chatList={chatList}
      currentChat={currentChat}
      handleClick={handleClick}
      userList={userList}
      onSearchChange={onSearchChange}
      searchModalIsOpen={searchModalIsOpen}
      toggleSearchModal={toggleSearchModal}
      selectUserFromList={selectUserFromList}
      createChatMessage={createChatMessage}
    />
  );
};

const mapStateToProps = ({
  user,
  chatList,
  currentChat,
  userList,
  socket,
}) => ({
  user,
  chatList,
  currentChat,
  userList,
  socket,
});

const mapDispatchToProps = {
  getChatList,
  updateCurrentChat,
  getUserList,
  startTypingSearchString,
  startSearching,
  selectUser,
  createChatRecord,
  closeSearchModel,
  userOnlineListener,
  joinNewRoomListener,
  userOfflineListener,
  typingListener,
  doneTypingListener,
  messagesDeliveredListener,
  messagesSeenListener,
  messageEventListener,
  messagesDeliveredSeenListener,
};

Screen.propTypes = {
  user: PropTypes.object.isRequired,
  userList: PropTypes.object.isRequired,
  getUserList: PropTypes.func.isRequired,
  chatList: PropTypes.array.isRequired,
  currentChat: PropTypes.string.isRequired,
  updateCurrentChat: PropTypes.func.isRequired,
  startTypingSearchString: PropTypes.func.isRequired,
  startSearching: PropTypes.func.isRequired,
  selectUser: PropTypes.func.isRequired,
  createChatRecord: PropTypes.func.isRequired,
  closeSearchModel: PropTypes.func.isRequired,
  userOnlineListener: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  joinNewRoomListener: PropTypes.func.isRequired,
  userOfflineListener: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
