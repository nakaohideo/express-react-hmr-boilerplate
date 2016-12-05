import { Schema } from 'normalizr';

export let todoSchema = new Schema('todos', {
  idAttribute: '_id',
});
