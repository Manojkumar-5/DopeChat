import React from 'react';
import { Loader } from 'semantic-ui-react';
import '../../assets/css/loader.css';
import PropTypes from 'prop-types';

const PreLoader = ({ size, full }) => (
  <div className={` ${full ? 'fullscreen-loader' : 'container-loader'}`}>
    <Loader active inline="centered" size={size} />
  </div>
);

PreLoader.propTypes = {
  size: PropTypes.string.isRequired,
  full: PropTypes.bool.isRequired,
};

export default PreLoader;
