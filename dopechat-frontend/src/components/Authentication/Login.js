import React from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PreLoader from '../common/PreLoader';

const Login = ({
  loginDetails,
  handleChange,
  submitHandler,
  error,
  formErrors,
  isLoading,
}) => (
  <>
    <Grid style={{ margin: '0px' }}>
      <Grid.Row>
        <Grid.Column width={3} />
        <Grid.Column width={6} className="auth-container">
          <Grid.Row centered className="auth-header">
            <h2>Login</h2>
          </Grid.Row>
          <Form size="large">
            <Form.Input
              placeholder="Email"
              name="email"
              value={loginDetails.email}
              onChange={handleChange}
              type="email"
              label="Email"
              required
              error={formErrors.email}
            />
            <Form.Input
              placeholder="Password"
              name="password"
              value={loginDetails.password}
              onChange={handleChange}
              type="password"
              label="Password"
              required
              error={formErrors.password}
            />
          </Form>

          <Grid.Row centered className="auth-footer">
            <Button
              size="big"
              onClick={submitHandler}
              className="auth-footer-btn"
            >
              Login
            </Button>

            {isLoading && <PreLoader size="massive" />}

            {error && (
              <Grid.Row centered className="auth-footer-error">
                <Message negative>
                  <Message.Header>{error}</Message.Header>
                </Message>
              </Grid.Row>
            )}
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={3} />
      </Grid.Row>
    </Grid>
  </>
);

Login.propTypes = {
  loginDetails: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  formErrors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Login;
