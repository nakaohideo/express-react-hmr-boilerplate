import { Schema } from 'normalizr';

export let todoSchema = new Schema('todos', {
  idAttribute: '_id',
});

export let userSchema = new Schema('users', {
  idAttribute: '_id',
});
