import ActionTypes from '../constants/ActionTypes';
import { setEntities } from './entityActions';

export const setPages = (resource, page, ids) => {
  return {
    type: ActionTypes.SET_PAGES,
    resource,
    page,
    ids,
  };
};

export const setCrrentPage = (resource, currentPage) => {
  return {
    type: ActionTypes.SET_CURRENT_PAGE,
    resource,
    currentPage,
  };
};

export const prependEntitiesIntoPage = (resource, normalized, intoPage) => {
  return (dispatch, getState) => {
    dispatch(setEntities(normalized));
    dispatch({
      type: ActionTypes.PREPEND_ENTITIES_INTO_PAGE,
      resource,
      ids: normalized.result,
      intoPage,
    });
  };
};

export const apendEntitiesIntoPage = (resource, normalized, intoPage) => {
  return (dispatch, getState) => {
    dispatch(setEntities(normalized));
    dispatch({
      type: ActionTypes.APPEND_ENTITIES_INTO_PAGE,
      resource,
      ids: normalized.result,
      intoPage,
    });
  };
};
