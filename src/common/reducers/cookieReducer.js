import cookie from 'cookie';
import ActionTypes from '../constants/ActionTypes';
import deserializeCookieMap from '../utils/deserializeCookieMap';

let initCookies = {};

if (process.env.BROWSER) {
  initCookies = deserializeCookieMap(cookie.parse(document.cookie));
} else {
  initCookies = {};
}

export default (state = initCookies, action) => {
  switch (action.type) {
    case ActionTypes.SET_COOKIE: {
      return {
        ...state,
        [action.cookie.name]: action.cookie.value,
      };
    }
    default: {
      return state;
    }
  }
};
