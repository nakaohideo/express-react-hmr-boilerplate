import ActionTypes from '../constants/ActionTypes';
import merge from 'lodash/merge';

let initState = {};

export default (state = initState, action) => {
  switch (action.type) {
    case ActionTypes.SET_ENTITIES: {
      return merge({}, state, action.normalized.entities);
    }
    default: {
      return state;
    }
  }
};
