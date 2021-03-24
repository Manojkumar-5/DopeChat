import React from 'react';
import { Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import TextMessage from './TextMessage';

const toTimeString = (sentTime) => {
  const t = new Date(sentTime);
  return `${t.getHours()}:${t.getMinutes()}`;
};

const MessageGroup = ({
  messages,
  date,
  isEditingAnyMessage,
  setIsEditingAnyMessage,
  onEditDelete,
  user,
}) => {
  const divider = (
    <Divider inverted horizontal>
      {date}
    </Divider>
  );

  const textMessages = messages.map(
    ({
      sender,
      messageContent,
      sentTime,
      isFile,
      messageNumber,
      eventType,
      seenTime,
      receivedTime,
    }) => {
      let { firstName, lastName } = sender.profile;
      firstName = firstName[0].toLocaleUpperCase() + firstName.slice(1);
      lastName = lastName[0].toLocaleUpperCase() + lastName.slice(1);
      const userName = `${firstName} ${lastName}`;
      const showInfo = sender._id === user.userId;
      if (eventType === 'DELETE') {
        return null;
      }
      return (
        <Grid.Row
          columns={16}
          style={{ marginTop: '-2%', marginBottom: '-1%', padding: '1%' }}
        >
          <TextMessage
            content={messageContent}
            date={toTimeString(sentTime)}
            avatar={sender.profile.avatar}
            userName={userName}
            setIsEditingAnyMessage={setIsEditingAnyMessage}
            isEditingAnyMessage={isEditingAnyMessage}
            isFile={isFile}
            onEditDelete={onEditDelete}
            messageNumber={messageNumber}
            seenTime={seenTime}
            receivedTime={receivedTime}
            showInfo={showInfo}
          />
        </Grid.Row>
      );
    }
  );

  return (
    <>
      {divider}
      {textMessages}
    </>
  );
};

MessageGroup.propTypes = {
  messages: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  isEditingAnyMessage: PropTypes.bool.isRequired,
  setIsEditingAnyMessage: PropTypes.func.isRequired,
};

export default MessageGroup;
