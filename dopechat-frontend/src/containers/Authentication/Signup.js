import React, { useState } from 'react';

import { connect } from 'react-redux';
import validator from 'validator';
import PropTypes from 'prop-types';
import SignupComponent from '../../components/Authentication/Signup';
import passwordValidator from '../../utils/passwordValidator';
import { signup } from '../../actions/auth';

const Signup = ({ signup }) => {
  const [signupDetails, setSignupDetails] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dob: '',
    mobile: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    dob: false,
    firstName: false,
    lastName: false,
    mobile: false,
  });

  const clearFormErrors = () => {
    setFormErrors({
      email: false,
      password: false,
      confirmPassword: false,
      dob: false,
      firstName: false,
      lastName: false,
      mobile: false,
    });
  };

  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    setError('');

    setTimeout(() => {
      clearFormErrors();
    }, 2000);

    const {
      email,
      password,
      confirmPassword,
      dob,
      firstName,
      lastName,
      mobile,
    } = signupDetails;

    if (!firstName) {
      setFormErrors({
        ...formErrors,
        firstName: {
          content: 'Please Enter Your First name',
          pointing: 'above',
        },
      });
      return;
    }

    if (!lastName) {
      setFormErrors({
        ...formErrors,
        lastName: {
          content: 'Please Enter Your Last name',
          pointing: 'above',
        },
      });
      return;
    }

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

    if (password !== confirmPassword) {
      // console.log(password, confirmPassword);
      setFormErrors({
        ...formErrors,
        confirmPassword: {
          content: 'Passwords Did Not Match',
          pointing: 'above',
        },
      });
      return;
    }

    if (Number.isNaN(new Date(dob).getTime()) || new Date(dob) > Date.now()) {
      setFormErrors({
        ...formErrors,
        dob: {
          content: 'Please Enter a valid Date Of Birth in the past',
          pointing: 'above',
        },
      });
      return;
    }

    if (!mobile || mobile.length !== 10) {
      setFormErrors({
        ...formErrors,
        mobile: {
          content: 'Please Enter Your Mobile Number ( 10 Digits )',
          pointing: 'above',
        },
      });
      return;
    }

    setIsLoading(true);
    const response = await signup({
      email,
      password,
      dob,
      firstName,
      lastName,
      mobile,
    });
    setIsLoading(false);

    if (response && response.ERROR) {
      setError(response.ERROR);
    }
  };

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'email':
        return setSignupDetails({ ...signupDetails, email: value });
      case 'password':
        return setSignupDetails({ ...signupDetails, password: value });
      case 'confirmPassword':
        return setSignupDetails({ ...signupDetails, confirmPassword: value });
      case 'firstName':
        return setSignupDetails({ ...signupDetails, firstName: value });
      case 'lastName':
        return setSignupDetails({ ...signupDetails, lastName: value });
      case 'dob':
        return setSignupDetails({ ...signupDetails, dob: value });
      case 'mobile':
        return setSignupDetails({ ...signupDetails, mobile: value });
      default:
    }
  };

  return (
    <SignupComponent
      handleChange={handleChange}
      signupDetails={signupDetails}
      submitHandler={submitHandler}
      error={error}
      formErrors={formErrors}
      isLoading={isLoading}
    />
  );
};

const mapDispatchToProps = {
  signup,
};

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Signup);
