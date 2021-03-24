import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ user, children, path }) => {
  if (user.userId) {
    return (
      <Route path={path} exact>
        {children}
      </Route>
    );
  }
  return <Redirect to="/" push />;
};

const mapStateToProps = ({ user }) => ({ user });

ProtectedRoute.propTypes = {
  user: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ProtectedRoute);
