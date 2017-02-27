import cookie from 'cookie';
import assign from 'object-assign';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import ActionTypes from '../constants/ActionTypes';
import { deserializeCookie } from '../utils/deserializeCookieMap';

export const setCookie = (name, value, options, res = null) => {
  options = assign({
    path: '/',
  }, options);
  let deserializedValue = deserializeCookie(value);

  return (dispatch, getState) => {
    let serializedValue;

    if (isString(value)) {
      serializedValue = value;
    } else if (isObject(value)) {
      serializedValue = JSON.stringify(value);
    }

    if (process.env.BROWSER) {
      document.cookie = cookie.serialize(
        name, serializedValue, options);
    } else if (res) {
      res.cookie(name, serializedValue);
    }

    dispatch({
      type: ActionTypes.SET_COOKIE,
      cookie: {
        name,
        value: deserializedValue,
        options,
      },
    });
  };
};

export const setCookies = (cookies, res = null) => {
  return (dispatch) => {
    Object
      .keys(cookies)
      .forEach((name) => dispatch(setCookie(name, cookies[name], {}, res)));
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
