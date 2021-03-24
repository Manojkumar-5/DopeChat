import React from 'react';
import { Button, Modal, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar';
import '../../assets/css/searchModal.css';

const SearchModal = ({
  userList,
  onSearchChange,
  searchModalIsOpen,
  toggleSearchModal,
  selectUserFromList,
  createChatMessage,
}) => (
  <>
    <Modal
      open={searchModalIsOpen}
      onClose={toggleSearchModal}
      className="custom-modal"
    >
      <div className="custom-modal-header">
        <SearchBar
          userList={userList}
          onSearchChange={onSearchChange}
          selectUserFromList={selectUserFromList}
        />
      </div>
      <div className="custom-modal-content">
        {createChatMessage.message && (
          <Message
            positive={createChatMessage.type === 'positive'}
            negative={createChatMessage.type === 'negetive'}
          >
            <Message.Header>{createChatMessage.message}</Message.Header>
          </Message>
        )}
      </div>
      <div className="custom-modal-footer">
        <Button negative onClick={toggleSearchModal}>
          Close
        </Button>
      </div>
    </Modal>
  </>
);

SearchModal.propTypes = {
  userList: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchModalIsOpen: PropTypes.bool.isRequired,
  toggleSearchModal: PropTypes.func.isRequired,
  selectUserFromList: PropTypes.func.isRequired,
  createChatMessage: PropTypes.func.isRequired,
};

export default SearchModal;
