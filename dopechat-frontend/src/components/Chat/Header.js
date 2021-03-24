/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/chat.css';

const Header = ({ userName, online, lastSeen, avatar, typing }) => {
  // console.log(typing, 'Typing');
  return (
    <>
      <div className="chat-header-avatar">
        <img src={avatar} alt="" className={`${online && 'online'}`} />
      </div>
      <div className="chat-header-content">
        <span>{userName}</span>
        {!online ? (
          <span>{lastSeen}</span>
        ) : (
          <span>Online {typing && ' | typing....'} </span>
        )}
      </div>
    </>
  );
};

Header.propTypes = {
  userName: PropTypes.string.isRequired,
  online: PropTypes.bool.isRequired,
  lastSeen: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  typing: PropTypes.bool.isRequired,
};

export default Header;
