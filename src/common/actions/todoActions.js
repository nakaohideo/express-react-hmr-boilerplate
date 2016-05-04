import actionTypes from '../constants/actionTypes';

export const setTodo = (todos) => {
  return {
    type: actionTypes.SET_TODO,
    todos,
  };
};

export const addTodo = (todo) => {
  return {
    type: actionTypes.ADD_TODO,
    todo,
  };
};

export const removeTodo = (id) => {
  return {
    type: actionTypes.REMOVE_TODO,
    id,
  };
};