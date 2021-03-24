import React from 'react';
import { Button, Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const TopMenuBar = ({ logouthandler }) => (
  <Menu size="big" className="top-menu">
    <Menu.Menu position="right">
      <Menu.Item>
        <Button
          color="transparent"
          className="logout-btn"
          onClick={logouthandler}
        >
          Logout
          <Icon name="right arrow" />
        </Button>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

TopMenuBar.propTypes = {
  logouthandler: PropTypes.func.isRequired,
};

export default TopMenuBar;
