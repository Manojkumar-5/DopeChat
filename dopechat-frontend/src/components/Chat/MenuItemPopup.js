import React from 'react';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const MenuItemPopup = ({ header, trigger, position }) => (
  <Popup
    inverted
    position={position}
    on="hover"
    offset={[0, 6]}
    mouseEnterDelay={500}
    header={header}
    size="tiny"
    trigger={trigger}
  />
);

MenuItemPopup.propTypes = {
  header: PropTypes.string.isRequired,
  trigger: PropTypes.element.isRequired,
  position: PropTypes.string.isRequired,
};

export default MenuItemPopup;
