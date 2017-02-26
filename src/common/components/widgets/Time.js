// inspired by <https://github.com/andreypopp/react-time>
import React, { PropTypes } from 'react';
import moment from 'moment';

const Time = ({ value, format, relative, ...rest }) => {
  let v = null;
  if (value) {
    v = moment(value);
    v = relative ? v.fromNow() : v.format(format);
  }
  return (
    <time {...rest}>{v}</time>
  );
};

Time.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
};

Time.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  format: PropTypes.string,
  relative: PropTypes.bool,
};

export default Time;
