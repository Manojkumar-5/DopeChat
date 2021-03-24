import React, { useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const EditForm = ({
  editedMessage,
  isEditing,
  cancelClick,
  setEditedMessage,
  onEditDelete,
  messageNumber,
  content,
}) => {
  useEffect(() => {
    setEditedMessage(content);
  }, [isEditing]);
  const handleSubmit = async () => {
    if (!editedMessage.length) {
      return;
    }
    await onEditDelete(editedMessage, messageNumber);
    cancelClick();
  };

  return (
    <>
      <Form
        onSubmit={null}
        style={{ display: `${isEditing ? 'block' : 'none'}` }}
      >
        <Form.Input
          placeholder="Edit your message"
          type="text"
          required
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
        />
        <Button color="green" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="red" type="submit" onClick={cancelClick}>
          Cancel
        </Button>
      </Form>
    </>
  );
};

EditForm.propTypes = {
  editedMessage: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  cancelClick: PropTypes.func.isRequired,
  setEditedMessage: PropTypes.func.isRequired,
};

export default EditForm;
