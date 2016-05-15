import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
// import validator from 'validator';
import Form from '../main/Form';
import Input from '../reduxForm/Input';
import userAPI from '../../api/user';

const validate = (values) => {
  const errors = {};

  // if (values.email && !validator.isEmail(values.email)) {
  //   errors.email = 'Not an email';
  // }

  if (!values.email) {
    errors.email = 'Required';
  }

  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this._handleSubmit = ::this._handleSubmit;
  }

  _handleSubmit(formData) {
    userAPI
      .register(formData)
      .catch((err) => {
        alert('Register user fail');
        throw err;
      })
      .then((json) => {
        this.context.router.push('/');
      });
  }

  render() {
    const {
      fields: { name, email, password },
      handleSubmit,
    } = this.props;

    return (
      <Form horizontal onSubmit={handleSubmit(this._handleSubmit)}>
        <Input
          title="Name"
          type="text"
          placeholder="Name"
          field={name}
        />
        <Input
          title="Email"
          type="text"
          placeholder="Email"
          field={email}
        />
        <Input
          title="Password"
          type="password"
          placeholder="Password"
          field={password}
        />
        <Form.Button
          type="submit"
          title="Register"
        />
      </Form>
    );
  }
};

RegisterForm.contextTypes = {
  router: React.PropTypes.any.isRequired,
};

RegisterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'register',
  fields: [
    'name',
    'email',
    'password',
  ],
  validate,
})(RegisterForm);
