import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Table from 'react-bootstrap/lib/Table';
import Resources from '../../../../constants/Resources';
import userAPI from '../../../../api/user';
import { pushErrors } from '../../../../actions/errorActions';
import { setCrrentPage } from '../../../../actions/pageActions';
import { setUsers } from '../../../../actions/userActions';
import PageLayout from '../../../layouts/AdminPageLayout';
import Pager from '../../../utils/BsPager';

class ListPage extends Component {
  constructor() {
    super();
    this.handlePageChange = this._handlePageChange.bind(this);
    this.fetchUsers = this._fetchUsers.bind(this);
  }

  componentDidMount() {
    let { location } = this.props;

    this.fetchUsers(location.query.page || 1);
  }

  componentDidUpdate(prevProps) {
    let { page, users } = this.props;

    if (users.length === 0 && prevProps.page.current !== page.current) {
      this.fetchUsers(page.current);
    }
  }

  _handlePageChange(pageId) {
    let { dispatch } = this.props;

    dispatch(setCrrentPage(Resources.USER, pageId));
  }

  _fetchUsers(page) {
    let { dispatch, apiEngine, location } = this.props;

    userAPI(apiEngine)
      .list({ page })
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        dispatch(setUsers(json));
        dispatch(push({
          pathname: location.pathname,
          query: { page: json.page.current },
        }));
      });
  }

  render() {
    let { users, page } = this.props;

    return (
      <PageLayout>
        <PageHeader>User List ({`${page.current} / ${page.total}`})</PageHeader>
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <img
                    src={user.avatarURL}
                    style={{
                      maxHeight: 32,
                    }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email.value}</td>
                <td>{user.role}</td>
                <td>{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pager
          page={page}
          onPageChange={this.handlePageChange}
        />
      </PageLayout>
    );
  }
}

export default connect(({ apiEngine, pagination, entity }) => {
  let { page } = pagination.users;
  let userPages = pagination.users.pages[page.current] || { ids: [] };
  let users = userPages.ids.map(id => entity.users[id]);

  return {
    apiEngine,
    users,
    page,
  };
})(ListPage);
