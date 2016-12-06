import union from 'lodash/union';
import { combineReducers } from 'redux';
import Resources from '../constants/Resources';
import ActionTypes from '../constants/ActionTypes';

// action = {
//   type: ActionTypes.SET_PAGES,
//   resource: Resources.TODO,
//   page: {
//     current: 2,
//   },
//   ids: ['id1', 'id2', ...],
// }

// state.pagination = {
//   todos: {
//     page: {
//       skip: 0,
//       limit: 0,
//       first: 0,
//       current: 1,
//       last: 0,
//       total: 0,
//     },
//     pages: {
//       1: {
//         ids: [ 'todo1', 'todo2' ],
//         isFetching: false
//       },
//       2: {
//         ids: [ 'todo3', 'todo4' ],
//         isFetching: false
//       },
//       3: {
//         ids: [],
//         isFetching: true
//       },
//       ...  // and so on
//     }
//   },
// },

let resourcePageReducer = (state = {
  skip: 0,
  limit: 20,
  first: 1,
  current: 1,
  last: 1,
  total: 1,
}, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGES: {
      return {
        ...state,
        ...action.page,
      };
    }
    case ActionTypes.SET_CURRENT_PAGE: {
      return {
        ...state,
        current: action.currentPage,
      };
    }
    default: {
      return state;
    }
  }
};

let resourceSinglePageReducer = (state = {
  ids: [],
}, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGES:
    case ActionTypes.APPEND_ENTITIES_INTO_PAGE: {
      return {
        ...state,
        ids: union(state.ids, action.ids),
      };
    }
    case ActionTypes.PREPEND_ENTITIES_INTO_PAGE: {
      return {
        ...state,
        ids: union(action.ids, state.ids),
      };
    }
    case ActionTypes.REMOVE_ENTITIES_FROM_PAGE: {
      return {
        ...state,
        ids: [
          ...state.ids
            .filter((id) => action.ids.indexOf(id) === -1),
        ],
      };
    }
    default: {
      return state;
    }
  }
};

let resourcePagesReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGES: {
      let currPage = action.page.current;

      return {
        ...state,
        [currPage]: resourceSinglePageReducer(state[currPage], action),
      };
    }
    case ActionTypes.PREPEND_ENTITIES_INTO_PAGE:
    case ActionTypes.APPEND_ENTITIES_INTO_PAGE: {
      let { intoPage } = action;

      return {
        ...state,
        [intoPage]: resourceSinglePageReducer(state[intoPage], action),
      };
    }
    case ActionTypes.REMOVE_ENTITIES_FROM_PAGE: {
      let newPages = {};
      for (let pageId in state) {
        newPages[pageId] = resourceSinglePageReducer(state[pageId], action);
      }
      return {
        ...newPages,
      };
    }
    default: {
      return state;
    }
  }
};

let resourcePaginationReducer = combineReducers({
  page: resourcePageReducer,
  pages: resourcePagesReducer,
});

let paginate = (resource) => (state = {}, action) => {
  if (action.resource === resource) {
    return resourcePaginationReducer(state, action);
  } else {
    return resourcePaginationReducer(state, { type: null });
  }
};

let paginationReducer = combineReducers({
  todos: paginate(Resources.TODO),
  users: paginate(Resources.USER),
});

export default paginationReducer;
