import React, { useState } from 'react';

import { Message, Comment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PopupOptions from './PopupOptions';
import EditForm from './EditForm';

const TextMessage = ({
  userName,
  avatar,
  date,
  content,
  isFile,
  isEditingAnyMessage,
  setIsEditingAnyMessage,
  onEditDelete,
  messageNumber,
  receivedTime,
  seenTime,
  showInfo,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editedMessage, setEditedMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const hoverColor = '#212529';
  const nonHoverColor = '#1A1D21';
  const msgColor = hovered ? hoverColor : nonHoverColor;

  const openCloseEditForm = () => {
    if (isEditingAnyMessage && !isEditing) {
      return;
    }
    setIsEditingAnyMessage(!isEditingAnyMessage);
    setIsEditing(!isEditing);
  };

  const cancelClick = () => {
    setIsEditingAnyMessage(false);
    setIsEditing(!isEditing);
    setEditedMessage('');
  };

  const formElement = hovered ? (
    <div className="popup-hover">
      <PopupOptions
        openCloseEditForm={openCloseEditForm}
        isFile={isFile}
        onEditDelete={onEditDelete}
        messageNumber={messageNumber}
        receivedTime={receivedTime}
        seenTime={seenTime}
        showInfo={showInfo}
      />
    </div>
  ) : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Message style={{ width: '100%', backgroundColor: `${msgColor}` }}>
        {formElement}
        <Message.Header>
          <Comment.Group style={{ width: '100%', maxWidth: '2000000px' }}>
            <Comment>
              <Comment.Avatar src={avatar} />
              <Comment.Content>
                <Comment.Author as="a" style={{ color: 'whitesmoke' }}>
                  {userName}
                </Comment.Author>
                <Comment.Metadata>
                  <div
                    style={{
                      color: 'whitesmoke',
                      fontWeight: 'lighter',
                      fontSize: '10px',
                    }}
                  >
                    {date}
                  </div>
                </Comment.Metadata>
                {!isEditing && (
                  <Comment.Text
                    style={{ color: 'whitesmoke', fontWeight: 'lighter' }}
                  >
                    {isFile ? (
                      <a
                        href={content.split('#@')[0]}
                        rel="noreferrer"
                        target="_blank"
                        download
                      >
                        {content.split('#@')[1]}
                      </a>
                    ) : (
                      content
                    )}
                  </Comment.Text>
                )}
                <EditForm
                  editedMessage={editedMessage}
                  isEditing={isEditing}
                  cancelClick={cancelClick}
                  setEditedMessage={setEditedMessage}
                  onEditDelete={onEditDelete}
                  messageNumber={messageNumber}
                  content={content}
                />
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Message.Header>
      </Message>
    </div>
  );
};

TextMessage.propTypes = {
  userName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  isEditingAnyMessage: PropTypes.bool.isRequired,
  setIsEditingAnyMessage: PropTypes.func.isRequired,
};

export default TextMessage;
