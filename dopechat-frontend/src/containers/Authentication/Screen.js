import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Wrapper from '../../components/Authentication/Wrapper';

const Screen = ({ user }) => {
  if (!user.userId) {
    return <Wrapper />;
  }
  return (
    <div>
      <Redirect to="/home" />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

Screen.propTypes = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Screen);
