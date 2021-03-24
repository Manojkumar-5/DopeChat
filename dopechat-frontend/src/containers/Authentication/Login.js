import React, { useState } from 'react';

import { connect } from 'react-redux';
import validator from 'validator';
import PropTypes from 'prop-types';
import LoginComponent from '../../components/Authentication/Login';
import passwordValidator from '../../utils/passwordValidator';
import { login } from '../../actions/auth';

const Login = ({ login }) => {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e, { name, value }) => {
    if (name === 'email') {
      setLoginDetails({ ...loginDetails, email: value });
    }
    if (name === 'password') {
      setLoginDetails({ ...loginDetails, password: value });
    }
  };

  const clearFormErrors = () => {
    setFormErrors({
      email: false,
      password: false,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setError('');

    setTimeout(() => {
      clearFormErrors();
    }, 2000);

    const { email, password } = loginDetails;
    if (!validator.isEmail(email)) {
      setFormErrors({
        ...formErrors,
        email: {
          content: 'Please Enter A Valid Email Address',
          pointing: 'above',
        },
      });
      return;
    }

    if (!passwordValidator(password)) {
      setFormErrors({
        ...formErrors,
        password: {
          content: 'Please Enter A Valid Password',
          pointing: 'above',
        },
      });
      return;
    }

    setIsLoading(true);
    const response = await login({ email, password });
    setIsLoading(false);

    if (response && response.ERROR) {
      setError(response.ERROR);
    }
  };

  return (
    <LoginComponent
      loginDetails={loginDetails}
      handleChange={handleChange}
      submitHandler={submitHandler}
      error={error}
      formErrors={formErrors}
      isLoading={isLoading}
    />
  );
};

const mapDispatchToProps = {
  login,
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
