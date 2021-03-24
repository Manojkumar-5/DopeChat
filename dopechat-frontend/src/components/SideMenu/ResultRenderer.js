import React from 'react';
import PropTypes from 'prop-types';

const ResultRenderer = ({ firstName, lastName, avatar }) => {
  const name = `${firstName} ${lastName}`;
  return (
    <div className="search-tile">
      <div className="search-tile-image">
        <img src={avatar} alt="" />
      </div>
      <div className="search-tile-content">{name}</div>
    </div>
  );
};

ResultRenderer.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default ResultRenderer;
