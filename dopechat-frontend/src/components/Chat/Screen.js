import React, { useState, useRef, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import '../../assets/css/chat.css';
import moment from 'moment';
import PropTypes from 'prop-types';
import Header from './Header';
import TextBoxMenu from './TextBoxMenu';
import MessageGroup from './MessageGroup';
import TextBox from './TextBox';
import { messageGroupDate } from '../../utils/formatDate';

const Screen = ({
  currentChat,
  chatList,
  onSubmit,
  chatMessages,
  onFileSubmit,
  onEditDelete,
  user,
  fetchEvents,
}) => {
  const chat = chatList
    .map((chat) => chat._id === currentChat && chat)
    .filter((chat) => {
      return chat !== undefined && chat;
    })[0];
  const chatUser = typeof chat.user1 === 'object' ? chat.user1 : chat.user2;
  const chatUserProfile = chatUser.profile;
  let { firstName, lastName } = chatUserProfile;
  firstName = firstName[0].toLocaleUpperCase() + firstName.slice(1);
  lastName = lastName[0].toLocaleUpperCase() + lastName.slice(1);
  const userName = `${firstName} ${lastName}`;

  const [focused, setfocused] = useState(false);
  const [isEditingAnyMessage, setIsEditingAnyMessage] = useState(false);

  const [text, setText] = useState(null);

  const chatObject =
    chatMessages.find((chat) => chat._id === currentChat) || {};

  const getDate = (dateObj) => {
    const date = new Date(dateObj);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  };

  const groupMessages = (messages) => {
    const groupedMessages = {};
    messages.forEach((event) => {
      const { sentTime } = event;
      const date = getDate(sentTime);
      if (date in groupedMessages) groupedMessages[date].push(event);
      else groupedMessages[date] = [event];
    });
    return groupedMessages;
  };

  const messages = chatObject.messages || [];
  const groupedMessages = groupMessages(messages);

  const messageGroups = Object.keys(groupedMessages).map((date) => {
    return (
      <MessageGroup
        messages={groupedMessages[date]}
        setIsEditingAnyMessage={setIsEditingAnyMessage}
        isEditingAnyMessage={isEditingAnyMessage}
        date={messageGroupDate(date)}
        onEditDelete={onEditDelete}
        user={user}
      />
    );
  });

  const chatScrollRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (chatScrollRef && !isScrolled) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
    setIsScrolled(false);
  }, [chatMessages]);

  const onScrolllistener = async () => {
    if (chatScrollRef.current.scrollTop === 0) {
      setIsScrolled(true);
      const response = await fetchEvents(currentChat, true);
      if (response) {
        chatScrollRef.current.scrollTop = 500;
      }
    }
  };

  return (
    <>
      <Grid.Row className="chat-container">
        <Grid.Row className="chat-header">
          <Header
            userName={userName}
            lastSeen={moment(chatUserProfile.lastSeen).fromNow()}
            online={chatUserProfile.online}
            avatar={chatUserProfile.avatar}
            typing={chatUserProfile.typing}
          />
        </Grid.Row>
        <div
          className="chat-content"
          ref={chatScrollRef}
          onScroll={onScrolllistener}
        >
          {messageGroups}
        </div>
        <Grid.Row className={`chat-menu ${focused && 'focus'}`}>
          <TextBox
            username={userName}
            onSubmit={onSubmit}
            focused={focused}
            setfocused={setfocused}
            text={text}
            setText={setText}
          />
          <TextBoxMenu
            onSubmit={onSubmit}
            text={text}
            setText={setText}
            onFileSubmit={onFileSubmit}
          />
        </Grid.Row>
        <div
          style={{
            textAlign: 'right',
            margin: '-4px 22px 10px 0px',
            color: 'lightgrey',
            fontSize: '11px',
          }}
        >
          Return + Shift to go to new line
        </div>
      </Grid.Row>
    </>
  );
};

Screen.propTypes = {
  currentChat: PropTypes.string.isRequired,
  chatList: PropTypes.array.isRequired,
  createEvent: PropTypes.func.isRequired,
};

export default Screen;
