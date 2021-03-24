import React from 'react';
import { Button, Form, Grid, Message, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PreLoader from '../common/PreLoader';

const Signup = ({
  signupDetails,
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
        <Grid.Column width={8} className="auth-container">
          <Grid.Row centered className="auth-header">
            <h2>Signup</h2>
          </Grid.Row>
          <Form size="large">
            <Form.Input
              placeholder="First Name"
              name="firstName"
              value={signupDetails.firstName}
              onChange={handleChange}
              type="text"
              label="First Name"
              required
              error={formErrors.firstName}
            />
            <Form.Input
              placeholder="Last Name"
              name="lastName"
              value={signupDetails.lastName}
              onChange={handleChange}
              type="text"
              label="Last Name"
              required
              error={formErrors.lastName}
            />
            <Form.Input
              placeholder="Email"
              name="email"
              value={signupDetails.email}
              onChange={handleChange}
              type="email"
              label="Email"
              required
              error={formErrors.email}
            />
            <Form.Field>
              <Form.Input
                placeholder="Password"
                name="password"
                value={signupDetails.password}
                onChange={handleChange}
                type="password"
                label="Password"
                required
                error={formErrors.password}
              />
              <Label
                pointing="above"
                size="medium"
                className="auth-password-label"
              >
                Password must have 8 characters. Contain at lease one uppercase,
                lowercase, number and symbol.
              </Label>
            </Form.Field>
            <Form.Input
              placeholder="Confirm Password"
              name="confirmPassword"
              value={signupDetails.confirmPassword}
              onChange={handleChange}
              type="password"
              label="Confirm Password"
              required
              error={formErrors.confirmPassword}
            />
            <Form.Field>
              <Form.Input
                placeholder="Date Of Birth"
                name="dob"
                value={signupDetails.dob}
                onChange={handleChange}
                type="text"
                label="Date Of Birth"
                required
                error={formErrors.dob}
              />
              <Label
                pointing="above"
                size="medium"
                className="auth-password-label"
              >
                Date Format - MM/DD/YYYY
              </Label>
            </Form.Field>
            <Form.Input
              placeholder="Mobile Number"
              name="mobile"
              value={signupDetails.mobile}
              onChange={handleChange}
              type="text"
              label="Mobile Number"
              required
              error={formErrors.mobile}
            />
          </Form>

          <Grid.Row centered className="auth-footer">
            <Button
              size="big"
              onClick={submitHandler}
              className="auth-footer-btn"
            >
              Signup
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

Signup.propTypes = {
  signupDetails: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  formErrors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Signup;
