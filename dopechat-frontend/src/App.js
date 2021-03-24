import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import AuthenticationPage from './containers/Authentication/Screen';
import HomePage from './containers/Home/Screen';
import ProtectedRoute from './containers/Common/ProtectedRoute';
import { getUserId } from './actions/user';
import { setSocket } from './actions/socket';
import PreLoader from './components/common/PreLoader';

const App = ({ getUserId, setSocket }) => {
  const getUserIdRef = useRef(getUserId);
  const setSocketRef = useRef(setSocket);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);

    // useEffect hack for async functions
    const asyncFunc = async () => {
      await getUserIdRef.current();
      setIsLoading(false);
    };
    asyncFunc();
    const socket = io('https://9378d11c8bf1.ngrok.io', {
      autoConnect: false,
    });
    setSocketRef.current(socket);
  }, []);

  return !isLoading ? (
    <Router>
      <Switch>
        <Route exact path="/">
          <AuthenticationPage />
        </Route>
        <ProtectedRoute path="/home">
          <HomePage />
        </ProtectedRoute>
      </Switch>
    </Router>
  ) : (
    <PreLoader size="massive" full />
  );
};

App.propTypes = {
  getUserId: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getUserId,
  setSocket,
};

export default connect(null, mapDispatchToProps)(App);
