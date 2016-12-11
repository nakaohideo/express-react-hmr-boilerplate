import ActionTypes from '../constants/ActionTypes';

export const setEntities = (normalized) => {
  return {
    type: ActionTypes.SET_ENTITIES,
    normalized,
  };
};

export const removeEntities = (resource, ids) => {
  return {
    type: ActionTypes.REMOVE_ENTITIES_FROM_PAGE,
    resource,
    ids,
  };
};
