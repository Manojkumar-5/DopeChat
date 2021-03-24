/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Menu, Grid, Icon } from 'semantic-ui-react';
import '../../assets/css/sidemenu.css';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import SearchModal from './SearchModal';

const Screen = ({
  chatList,
  currentChat,
  handleClick,
  userList,
  onSearchChange,
  searchModalIsOpen,
  toggleSearchModal,
  selectUserFromList,
  createChatMessage,
}) => (
  <>
    <Grid.Row className="home-sidebar-container">
      <Grid.Row className="sidebar-header">
        <h2>DOPECHAT</h2>
      </Grid.Row>
      <Menu pointing vertical className="home-sidebar">
        <div onClick={toggleSearchModal} className="add-conversation-container">
          <span>Start New Conversation</span>
          <Icon name="add circle" />
        </div>
        <SearchModal
          searchModalIsOpen={searchModalIsOpen}
          userList={userList}
          toggleSearchModal={toggleSearchModal}
          onSearchChange={onSearchChange}
          selectUserFromList={selectUserFromList}
          createChatMessage={createChatMessage}
        />
        <div className="chatlist">
          {chatList ? (
            chatList.map((menuItem) => (
              <MenuItem
                key={menuItem._id}
                menuItem={menuItem}
                currentChat={currentChat}
                handleClick={handleClick}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3>Much Empty :(</h3>
              <h4>Start a Conversation Above!!</h4>
            </div>
          )}
        </div>
      </Menu>
    </Grid.Row>
  </>
);

Screen.propTypes = {
  chatList: PropTypes.array.isRequired,
  currentChat: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  userList: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchModalIsOpen: PropTypes.bool.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,
  selectUserFromList: PropTypes.func.isRequired,
  createChatMessage: PropTypes.func.isRequired,
};

export default Screen;
