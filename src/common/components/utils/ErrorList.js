import React from 'react';
import { push } from 'react-router-redux';
import isString from 'lodash/isString';
import { connect } from 'react-redux';
import Grid from 'react-bootstrap/lib/Grid';
import Alert from 'react-bootstrap/lib/Alert';
import Table from 'react-bootstrap/lib/Table';
import { removeError } from '../../actions/errorActions';
import ErrorCodes from '../../constants/ErrorCodes';

function renderMetaContent(metaContent) {
  if (isString(metaContent)) {
    return metaContent;
  }

  return (
    <pre>
      {JSON.stringify(metaContent, null, 2)}
    </pre>
  );
}

function renderMeta(meta) {
  if (isString(meta)) {
    return (
      <p>
        {meta}
      </p>
    );
  }

  return (
    <Table
      condensed
      responsive
      style={{
        marginBottom: 0,
        background: 'white',
      }}
    >
      <tbody>
        {Object.keys(meta).map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              {renderMetaContent(meta[key])}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

let ErrorList = ({ errors, dispatch }) => (
  <Grid>
    {errors.map((error) => {
      if ([
        ErrorCodes.TOKEN_EXPIRATION,
        ErrorCodes.BAD_TOKEN,
      ].indexOf(error.code) >= 0) {
        dispatch(removeError(error.id));
        dispatch(push('/user/login'));
      }
      if ([
        ErrorCodes.USER_UNAUTHORIZED,
        ErrorCodes.PERMISSION_DENIED,
      ].indexOf(error.code) >= 0) {
        dispatch(removeError(error.id));
        dispatch(push('/'));
      }

      return (
        <Alert
          key={error.id}
          bsStyle="danger"
          onDismiss={() => dispatch(removeError(error.id))}
        >
          <h4>{error.title}</h4>
          {' ' + error.detail}
          {error.meta && renderMeta(error.meta)}
        </Alert>
      );
    })}
  </Grid>
);

export default connect(state => ({
  errors: state.errors,
}))(ErrorList);
