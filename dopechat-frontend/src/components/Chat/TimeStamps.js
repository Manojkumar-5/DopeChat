import React from 'react';
import { formatSeenDeliveredDate } from '../../utils/formatDate';
import { Grid, Icon } from 'semantic-ui-react';

const TimeStamps = ({ seenTimeLocal, deliveredTimeLocal }) => {
  return (
    <div className="timestamps-container">
      <div className="timestamps">
        <p style={{ margin: '0px' }}>
          <Icon name="arrow right" color="blue"></Icon>
          <span>Delivered</span>
        </p>
        {deliveredTimeLocal ? (
          <span style={{ color: 'rgb(160,160,160)' }}>
            {formatSeenDeliveredDate(deliveredTimeLocal)}
          </span>
        ) : (
          <span>&nbsp;___</span>
        )}
      </div>
      <hr></hr>
      <div className="timestamps">
        <p style={{ margin: '0px' }}>
          <Icon name="arrow right" color="green"></Icon>
          <span>Read</span>
        </p>
        {seenTimeLocal ? (
          <span style={{ color: 'rgb(160,160,160)' }}>
            {formatSeenDeliveredDate(seenTimeLocal)}
          </span>
        ) : (
          <span>&nbsp;___</span>
        )}
      </div>
    </div>
  );
};

export default TimeStamps;
