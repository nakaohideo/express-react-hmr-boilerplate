import { normalize, arrayOf } from 'normalizr';
import { todoSchema } from '../schemas';
import Resources from '../constants/Resources';
import { setEntities, removeEntities } from './entityActions';
import { setPages, prependEntitiesIntoPage } from './pageActions';

export const setTodos = (res) => (dispatch, getState) => {
  let normalized = normalize(res.todos, arrayOf(todoSchema));

  dispatch(setEntities(normalized));
  dispatch(setPages(Resources.TODO, res.page, normalized.result));
};

export const addTodo = (todo) => (dispatch, getState) => {
  let normalized = normalize([todo], arrayOf(todoSchema));

  dispatch(prependEntitiesIntoPage(
    Resources.TODO,
    normalized,
    1
  ));
};

export const removeTodo = (id) => removeEntities(Resources.TODO, [id]);
