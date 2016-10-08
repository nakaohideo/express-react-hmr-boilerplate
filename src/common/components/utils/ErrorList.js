import React from 'react';
import { connect } from 'react-redux';
import Errors from '../../constants/Errors';
import { removeError } from '../../actions/errorActions';
import Container from '../main/Container';

let ErrorList = ({ errors, dispatch }) => (
  <Container>
    {errors.map((error) => (
      <div
        key={error.id}
        className="alert alert-danger alert-dismissible"
        role="alert"
      >
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={() => dispatch(removeError(error.id))}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>{error.title}</strong>
        {' ' + error.detail}
        {error.meta && [(
          <p key="0">
            {error.code === Errors.STATE_PRE_FETCHING_FAIL.code && (
              <span>{error.meta.detail}</span>
            )}
          </p>
        ), (
          <p key="1">
            {error.meta.path && `(at path '${error.meta.path}')`}
          </p>
        )]}
      </div>
    ))}
  </Container>
);

export default connect(state => ({
  errors: state.errors,
}))(ErrorList);
