/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const MenuItem = ({ menuItem, currentChat, handleClick }) => {
  const hasUnreadMessages = menuItem.unread > 0;

  const shouldAddPadding = menuItem.unread > 9;

  const otherUser =
    typeof menuItem.user1 === 'object'
      ? menuItem.user1.profile
      : menuItem.user2.profile;

  let { firstName, lastName } = otherUser;
  firstName = firstName[0].toLocaleUpperCase() + firstName.slice(1);
  lastName = lastName[0].toLocaleUpperCase() + lastName.slice(1);
  const name = `${firstName} ${lastName}`;

  return (
    <>
      <div
        className={`user-tile-wrapper ${
          currentChat === menuItem._id && 'active'
        }`}
        onClick={() => handleClick(menuItem._id)}
      >
        <div className="user-tile">
          <div className="user-tile-avatar">
            <img src={otherUser.avatar} alt="" />
            <div>{otherUser.online && <span className="online-circle" />}</div>
          </div>

          <div className={`user-tile-content ${hasUnreadMessages && 'active'}`}>
            {name}
          </div>

          <div className="user-tile-label">
            {hasUnreadMessages && (
              <Label className={`${shouldAddPadding && 'padded'}`}>
                {menuItem.unread}
              </Label>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

MenuItem.propTypes = {
  menuItem: PropTypes.object.isRequired,
  currentChat: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default MenuItem;
