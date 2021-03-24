import React from 'react';
import { Icon, Button, Popup, Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import pastDate from '../../utils/pastDate';
import { formatSeenDeliveredDate } from '../../utils/formatDate';
import TimeStamps from './TimeStamps';

const PopupOptions = ({
  openCloseEditForm,
  isFile,
  onEditDelete,
  messageNumber,
  receivedTime,
  seenTime,
  showInfo,
}) => {
  const seenTimeLocal =
    new Date(seenTime).getTime() === pastDate.getTime() ? null : seenTime;
  const deliveredTimeLocal =
    new Date(receivedTime).getTime() === pastDate.getTime()
      ? null
      : receivedTime;

  return (
    <>
      {showInfo && (
        <div className="popup-container">
          {!isFile && (
            <Icon
              name="edit"
              className="popup-icon"
              color="yellow"
              onClick={openCloseEditForm}
            />
          )}
          <Icon
            name="trash alternate outline"
            className="popup-icon"
            color="red"
            onClick={() => {
              onEditDelete(undefined, messageNumber);
            }}
          />
          <Popup
            trigger={
              <Icon name="info circle" color="blue" className="popup-icon" />
            }
            flowing
            hoverable
            position="bottom right"
            style={{ backgroundColor: 'black' }}
          >
            <TimeStamps
              seenTimeLocal={seenTimeLocal}
              deliveredTimeLocal={deliveredTimeLocal}
            ></TimeStamps>
          </Popup>
        </div>
      )}
    </>
  );
};

PopupOptions.propTypes = {
  openCloseEditForm: PropTypes.func.isRequired,
};

export default PopupOptions;
