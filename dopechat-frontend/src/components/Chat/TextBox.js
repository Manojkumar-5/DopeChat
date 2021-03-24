import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import TextAreaAutosize from 'react-textarea-autosize';
import { typingEmitter, doneTypingEmitter } from '../../actions/socket';

const TextBox = ({
  username,
  onSubmit,
  focused,
  setfocused,
  text,
  setText,
  typingEmitter,
  doneTypingEmitter,
}) => {
  const textAreaRef = useRef();

  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (typeof text === 'string') {
      if (timer) clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          doneTypingEmitter();
        }, 5000)
      );
      typingEmitter();
    }
  }, [text]);

  const onChangeHandler = (e) => {
    setText(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.which === 13 && !e.shiftKey && text && text.trim().length) {
      onSubmit(text.trim(), false);
      setText('');
      doneTypingEmitter();
      textAreaRef.current.setSelectionRange(0, 0);
    }
  };

  return (
    <Form>
      <TextAreaAutosize
        style={{ resize: 'none' }}
        onChange={onChangeHandler}
        onFocus={() => {
          setfocused(true);
        }}
        onBlur={() => {
          setfocused(false);
        }}
        onKeyPress={onKeyPress}
        value={text}
        ref={textAreaRef}
        placeholder={`Message ${username}`}
        className={`chat-text-area ${focused && 'focus'}`}
      />
    </Form>
  );
};

TextBox.propTypes = {
  username: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  setfocused: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  typingEmitter,
  doneTypingEmitter,
};

export default connect(null, mapDispatchToProps)(TextBox);
