import cookie from 'cookie';
import assign from 'object-assign';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import ActionTypes from '../constants/ActionTypes';
import { deserializeCookie } from '../utils/deserializeCookieMap';

export const setCookie = (name, value, options) => {
  options = assign({
    path: '/',
  }, options);
  let deserializedValue = deserializeCookie(value);

  return (dispatch, getState) => {
    return Promise
      .resolve(dispatch({
        type: ActionTypes.SET_COOKIE,
        cookie: {
          name,
          value: deserializedValue,
          options,
        },
      }))
      .then(() => {
        if (process.env.BROWSER) {
          let serializedValue;

          if (isString(value)) {
            serializedValue = value;
          } else if (isObject(value)) {
            serializedValue = JSON.stringify(value);
          }
          document.cookie = cookie.serialize(
            name, serializedValue, options);
        }
        return Promise.resolve();
      });
  };
};

export const setCookies = (cookies) => {
  return (dispatch) => {
    return Promise.all(
      Object
        .keys(cookies)
        .map((name) => dispatch(setCookie(name, cookies[name])))
    );
  };
};

export const removeCookie = (name) => {
  return (dispatch, getState) => {
    if (process.env.BROWSER) {
      return dispatch(setCookie(name, '', {
        expires: new Date(1970, 1, 1, 0, 0, 1),
      }));
    }
    return Promise.resolve();
  };
};
