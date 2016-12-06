import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Resources from '../../../constants/Resources';
import todoAPI from '../../../api/todo';
import { pushErrors } from '../../../actions/errorActions';
import { setCrrentPage } from '../../../actions/pageActions';
import {
  setTodos,
  addTodo,
  removeTodo,
} from '../../../actions/todoActions';
import PageLayout from '../../layouts/PageLayout';
import Pager from '../../utils/BsPager';

class TodoItem extends Component {
  constructor() {
    super();
    this.state = {
      isEditable: false,
      inputValue: '',
    };
  }

  renderInput() {
    let { inputValue } = this.state;

    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => this.setState({
          inputValue: e.target.value,
        })}
      />
    );
  }

  renderControlButtons() {
    let { text, onSaveClick } = this.props;
    let { isEditable, inputValue } = this.state;

    return isEditable ? (
      <span>
        <button
          onClick={() => (
            onSaveClick(inputValue)
              .then(() => this.setState({ isEditable: false }))
          )}
        >
          Save
        </button>
        <button onClick={() => this.setState({ isEditable: false })}>
          Cancel
        </button>
      </span>
    ) : (
      <span>
        <button
          onClick={() => this.setState({ isEditable: true, inputValue: text })}
        >
          Edit
        </button>
      </span>
    );
  }

  render() {
    let { onRemoveClick, text } = this.props;
    let { isEditable } = this.state;

    return (
      <li>
        {text}
        {isEditable && this.renderInput()}
        {this.renderControlButtons()}
        <button onClick={onRemoveClick}>x</button>
      </li>
    );
  }
}

class ListPage extends Component {
  constructor() {
    super();
    this.handlePageChange = this._handlePageChange.bind(this);
    this.fetchTodos = this._fetchTodos.bind(this);
    this.handleAddClick = this._handleAddClick.bind(this);
  }

  componentDidMount() {
    let { location } = this.props;

    this.fetchTodos(location.query.page || 1);
  }

  componentDidUpdate(prevProps) {
    let { page, todos } = this.props;

    if (todos.length === 0 && prevProps.page.current !== page.current) {
      this.fetchTodos(page.current);
    }
  }

  _handlePageChange(pageId) {
    let { dispatch } = this.props;

    dispatch(setCrrentPage(Resources.TODO, pageId));
  }

  _fetchTodos(page) {
    let { dispatch, apiEngine, location } = this.props;

    todoAPI(apiEngine)
      .list({ page })
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        dispatch(setTodos(json));
        dispatch(push({
          pathname: location.pathname,
          query: { page: json.page.current },
        }));
      });
  }

  _handleAddClick() {
    const { dispatch, apiEngine } = this.props;
    const text = this.refs.todotext.value;
    todoAPI(apiEngine)
      .create({ text })
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        dispatch(addTodo(json.todo));
        this.refs.todotext.value = '';
      });
  }

  handleSaveClick(id, newText) {
    let { dispatch, apiEngine } = this.props;

    return todoAPI(apiEngine)
      .update(id, { text: newText })
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        this.fetchTodos();
      });
  }

  handleRemoveClick(id) {
    const { dispatch, apiEngine } = this.props;
    todoAPI(apiEngine)
      .remove(id)
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        dispatch(removeTodo(id));
      });
  }

  render() {
    let { page } = this.props;

    return (
      <PageLayout>
        <PageHeader>Todo List ({`${page.current} / ${page.total}`})</PageHeader>
        <input
          disabled={page.current !== 1}
          type="text"
          ref="todotext"
        />
        <button
          disabled={page.current !== 1}
          onClick={this.handleAddClick}
        >
          Add Todo
        </button>
        {page.current !== 1 && (
          <div>
            The input box is only available for page 1
          </div>
        )}
        <ul>
          {this.props.todos.map((todo) =>
            <TodoItem
              key={todo._id}
              onRemoveClick={this.handleRemoveClick.bind(this, todo._id)}
              onSaveClick={this.handleSaveClick.bind(this, todo._id)}
              text={todo.text} />)}
        </ul>
        <Pager
          page={page}
          onPageChange={this.handlePageChange}
        />
      </PageLayout>
    );
  }
};

export default connect(({ apiEngine, pagination, entity }) => {
  let { page } = pagination.todos;
  let todoPages = pagination.todos.pages[page.current] || { ids: [] };
  let todos = todoPages.ids.map(id => entity.todos[id]);

  return {
    apiEngine,
    todos,
    page,
  };
})(ListPage);
