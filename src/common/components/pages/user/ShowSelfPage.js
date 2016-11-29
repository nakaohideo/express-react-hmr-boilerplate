import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Image from 'react-bootstrap/lib/Image';
import userAPI from '../../../api/user';
import { pushErrors } from '../../../actions/errorActions';
import PageLayout from '../../layouts/PageLayout';
import Time from '../../widgets/Time';
import VerifyEmailForm from '../../forms/user/VerifyEmailForm';
import toRefreshURL from '../../../utils/toRefreshURL';

class ShowSelfPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.initialUser,
      isShowVerifyEmailModal: false,
    };
    this.openModal = this._openModal.bind(this);
    this.closeModal = this._closeModal.bind(this);
  }

  componentDidMount() {
    let { dispatch, apiEngine } = this.props;

    userAPI(apiEngine)
      .readSelf()
      .catch((err) => {
        dispatch(pushErrors(err));
        throw err;
      })
      .then((json) => {
        json.user.avatarURL = toRefreshURL(json.user.avatarURL);
        this.setState({
          user: json.user,
        });
      });
  }

  _openModal() {
    this.setState({ isShowVerifyEmailModal: true });
  }

  _closeModal() {
    this.setState({ isShowVerifyEmailModal: false });
  }

  renderModal() {
    let { isShowVerifyEmailModal, user } = this.state;

    return (
      <Modal
        show={isShowVerifyEmailModal}
        onHide={this.closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Verification Mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VerifyEmailForm
            email={user.email && user.email.value}
            onCancel={this.closeModal}
          />
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { user } = this.state;
    return (
      <PageLayout>
        {this.renderModal()}
        <Row>
          <Col md={12}>
            <Link to="/user/me/edit">
              <Button bsStyle="primary">Edit My Profile</Button>
            </Link>
          </Col>
        </Row>
        <hr />
        <PageHeader>My Profile</PageHeader>
        <dl className="dl-horizontal">
          <dt>_id</dt>
          <dd>{user._id}</dd>
          <dt>avatar</dt>
          <dd>
            {user.avatarURL && <Image thumbnail src={user.avatarURL} />}
          </dd>
          <dt>name</dt>
          <dd>{user.name}</dd>
          <dt>email</dt>
          <dd>
            {user.email && user.email.value}
            {user.email && !user.email.isVerified && (
              <Button onClick={this.openModal}>
                Verify Now
              </Button>
            )}
          </dd>
          <dt>updatedAt</dt>
          <dd>
            <Time value={user.updatedAt} format="YYYY-MM-DD" />
            {' '}(<Time value={user.updatedAt} relative />)
          </dd>
          <dt>createdAt</dt>
          <dd>
            <Time value={user.createdAt} format="YYYY-MM-DD" />
            {' '}(<Time value={user.createdAt} relative />)
          </dd>
          <dt>raw</dt>
          <dd><pre>{JSON.stringify(user, null, 2)}</pre></dd>
        </dl>
      </PageLayout>
    );
  }
};

export default connect(({ apiEngine, cookies: { user } }) => ({
  apiEngine: apiEngine,
  initialUser: (user && JSON.parse(user)) || {},
}))(ShowSelfPage);
