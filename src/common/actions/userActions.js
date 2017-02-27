import { normalize, arrayOf } from 'normalizr';
import { userSchema } from '../schemas';
import Resources from '../constants/Resources';
import { setCookies, removeCookie } from './cookieActions';
import { setEntities } from './entityActions';
import { setPages } from './pageActions';

export const loginUser = ({ token, data }, res = null) => {
  return (dispatch) => {
    return dispatch(setCookies({
      token,
      user: data,
    }, res));
  };
};

export const logoutUser = () => {
  return (dispatch) => Promise.all([
    dispatch(removeCookie('token')),
    dispatch(removeCookie('user')),
  ]);
};

export const setUsers = (res) => (dispatch, getState) => {
  let normalized = normalize(res.users, arrayOf(userSchema));

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.USER, res.page, normalized.result));
};
