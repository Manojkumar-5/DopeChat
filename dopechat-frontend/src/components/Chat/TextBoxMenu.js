/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Icon, Menu, Button } from 'semantic-ui-react';
import MenuItemPopup from './MenuItemPopup';
import { doneTypingEmitter } from '../../actions/socket';

const TextBoxMenu = ({ onSubmit, text, setText, onFileSubmit }) => {
  const onSend = () => {
    if (text && text.trim().length) {
      onSubmit(text.trim(), false);
      setText('');
      doneTypingEmitter();
    }
  };

  const sendButton = (
    <Button icon color="green" circular size="tiny" onClick={onSend}>
      <Icon name="send" size="large" />
    </Button>
  );

  const onFileChange = (e) => {
    onFileSubmit(e.target.files[0]);
  };

  return (
    <Menu icon color="black" size="mini" borderless className="chat-menu-box">
      <Menu.Menu position="right">
        <Menu.Item>
          <input
            id="file1"
            type="file"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <label
            htmlFor="file1"
            style={{
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              backgroundColor: 'black',
              padding: '10px',
              borderRadius: '50%',
            }}
          >
            <Icon name="attach" style={{ margin: '0px' }} />
          </label>
        </Menu.Item>
        <Menu.Item>
          <MenuItemPopup
            position="top right"
            header="Send message"
            trigger={sendButton}
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default TextBoxMenu;
