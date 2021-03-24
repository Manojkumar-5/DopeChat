import React, { useState } from 'react';

import { Button, Icon, Grid } from 'semantic-ui-react';
import SignupContiner from '../../containers/Authentication/Signup';
import LoginContainer from '../../containers/Authentication/Login';
import '../../assets/css/auth.css';

const Wrapper = () => {
  const [isSignup, setIsSignup] = useState(false);

  const clickHandler = (e, { name }) => {
    if (name === 'login') {
      setIsSignup(false);
    } else if (name === 'signup') {
      setIsSignup(true);
    }
  };

  return (
    <div className="authscreen">
      <Grid container centered style={{ marginTop: '7rem' }}>
        <Grid.Row centered>
          <Grid.Column width={2} />
          <Grid.Column width={4}>
            <Button
              name="login"
              icon
              onClick={clickHandler}
              fluid
              labelPosition="right"
              className="wrapper-btn"
              size="big"
            >
              Login
              <Icon name="chevron right" />
            </Button>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column container width={4}>
            <Button
              name="signup"
              icon
              onClick={clickHandler}
              fluid
              labelPosition="right"
              className="wrapper-btn"
              size="big"
            >
              Signup
              <Icon name="signup" />
            </Button>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>

      {isSignup ? <SignupContiner /> : <LoginContainer />}
    </div>
  );
};

export default Wrapper;
