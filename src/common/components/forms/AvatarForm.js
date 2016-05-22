import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Form from '../main/Form';
import Input from '../reduxForm/Input';
import Image from '../main/Image';
import firebaseAPI from '../../api/firebase';

const validate = (values) => {
  const errors = {};

  if (!values.avatar) {
    errors.avatar = 'Required';
  }

  return errors;
};

class AvatarForm extends Component {
  constructor(props) {
    super(props);
    this._handleSubmit = ::this._handleSubmit;
    this.state = {
      avatarURL: null,
    };
  }

  componentDidMount() {
    firebaseAPI
      .readToken()
      .catch((err) => {
        alert('Read firebase token fail');
        throw err;
      })
      .then((json) => {
        // Initialize firebase
        const config = {
          apiKey: "AIzaSyARRM3F_eEaKVKvupqzD181KI7D_q7ASO0",
          authDomain: "express-react-hmr-boilerplate.firebaseapp.com",
          databaseURL: "https://express-react-hmr-boilerplate.firebaseio.com",
          storageBucket: "express-react-hmr-boilerplate.appspot.com",
        };
        firebase.initializeApp(config);

        // SignIn firebase
        firebase.auth()
          .signInWithCustomToken(json.token)
          .catch(function(err) {
            alert('Sign in firebase fail');
            throw err;
          });
      });
  }

  _handleSubmit(formData) {
    let _this = this;
    let { store } = this.context;
    let userId = store.getState().user.data._id;

    // ref: <https://firebase.google.com/docs/storage/web/upload-files#upload_files>
    let storageRef = firebase.storage().ref();
    let avatarRef = storageRef.child(`${userId}/avatar.jpg`);
    let uploadTask = avatarRef.put(formData.avatar[0]);

    uploadTask.on('state_changed', function(snapshot) {
      // Observe state change events such as progress, pause, and resume
      // See below for more detail
    }, function(error) {
      // Handle unsuccessful uploads
    }, function complete() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      let downloadURL = uploadTask.snapshot.downloadURL;
      _this.setState({
        avatarURL: downloadURL,
      });
    });
  }

  render() {
    const {
      fields: { avatar },
      handleSubmit,
    } = this.props;
    const { value: _, ...avatarWithoutValue } = avatar;

    return (
      <Form onSubmit={handleSubmit(this._handleSubmit)}>
        {this.state.avatarURL && <Image thumbnail src={this.state.avatarURL} />}
        <Input
          type="file"
          placeholder="Avatar"
          field={avatarWithoutValue}
        />
        <Form.Button
          type="submit"
          title="Upload"
        />
      </Form>
    );
  }
};

AvatarForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

AvatarForm.contextTypes = {
  store: PropTypes.object,
};

export default reduxForm({
  form: 'avatar',
  fields: [
    'avatar',
  ],
  validate,
})(AvatarForm);
