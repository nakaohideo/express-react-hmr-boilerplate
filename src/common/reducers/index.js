import { combineReducers } from 'redux';
import routing from './routerReducer';
import cookies from './cookieReducer';
import errors from './errorReducer';
import apiEngine from './apiEngineReducer';
import form from './formReducer';
import intl from './intlReducer';
import entity from './entityReducer';
import pagination from './paginationReducer';

const rootReducer = combineReducers({
  routing,
  cookies,
  errors,
  apiEngine,
  form, // must mount as `form` from redux-form's docs
  intl,
  entity,
  pagination,
});

export default rootReducer;
