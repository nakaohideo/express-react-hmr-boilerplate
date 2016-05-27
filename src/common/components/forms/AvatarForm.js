import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Form from '../main/Form';
import Input from '../reduxForm/Input';
import Image from '../main/Image';
import firebaseConfig from '../../../../config/firebase';
import userAPI from '../../api/user';
import firebaseAPI from '../../api/firebase';

const initialValues = {
  storage: 'local',
};

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
    this._uploadToLocal = ::this._uploadToLocal;
    this._uploadToFirebase = ::this._uploadToFirebase;
    this._signInFirebase = ::this._signInFirebase;
    this._handleSubmit = ::this._handleSubmit;
    this.state = {
      isFirebaseInitialized: false,
      avatarURL: null,
    };
  }

  _uploadToLocal(formData) {
    return userAPI(this.context.store.getState().apiEngine)
      .uploadAvatar(formData.avatar[0])
      .catch((err) => {
        return Promise.reject(err);
      })
      .then((json) => {
        return Promise.resolve(json.downloadURL);
      });
  }

  _signInFirebase() {
    return firebaseAPI(this.context.store.getState().apiEngine)
      .readToken()
      .catch((err) => {
        alert('Read firebase token fail');
        throw err;
      })
      .then((json) => {
        // Initialize firebase
        if (!this.state.isFirebaseInitialized) {
          firebase.initializeApp(firebaseConfig);
          this.setState({
            isFirebaseInitialized: true,
          });
        }

        // SignIn firebase
        return firebase.auth()
          .signInWithCustomToken(json.token)
          .catch(function(err) {
            alert('Sign in firebase fail');
            throw err;
          });
      });
  }

  _uploadToFirebase(formData) {
    let _this = this;
    let { store } = this.context;
    let userId = JSON.parse(store.getState().cookie.user)._id;

    return new Promise((resolve, reject) => {
      _this._signInFirebase().then(() => {
        // ref: <https://firebase.google.com/docs/storage/web/upload-files#upload_files>
        let storageRef = firebase.storage().ref();
        let avatarRef = storageRef.child(
          `${process.env.NODE_ENV}/${userId}/avatar.jpg`);
        let uploadTask = avatarRef.put(formData.avatar[0]);

        uploadTask.on('state_changed', function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // See below for more detail
        }, function(err) {
          // Handle unsuccessful uploads
          return reject(err);
        }, function complete() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          let downloadURL = uploadTask.snapshot.downloadURL;
          return resolve(downloadURL);
        });
      });
    });
  }

  _handleSubmit(formData) {
    let uploadProcedure;
    if (formData.storage === 'firebase') {
      uploadProcedure = this._uploadToFirebase(formData);
    } else if (formData.storage === 'local') {
      uploadProcedure = this._uploadToLocal(formData);
    }
    uploadProcedure
      .catch((err) => {
        alert('upload fail');
        throw err;
      })
      .then((downloadURL) => {
        userAPI(this.context.store.getState().apiEngine)
          .update({
            avatarURL: downloadURL,
          })
          .catch((err) => {
            alert('update user avatar URL fail');
            throw err;
          })
          .then((json) => {
            let forceUpdate = (downloadURL.indexOf('?') >= 0?
              '&': '?') + `forceUpdate=${Math.random()}`;
            this.setState({
              avatarURL: downloadURL + forceUpdate,
            });
          });
      });
  }

  render() {
    const {
      fields: {
        avatar,
        storage,
      },
      handleSubmit,
    } = this.props;
    const avatarURL = this.state.avatarURL || this.props.avatarURL;
    // use state from redux store instead of reduxForm props
    // to ensure server side render is working
    const avatarForm = this.context.store.getState().form.avatar;
    const { value: _, ...avatarWithoutValue } = avatar;

    return (
      <Form onSubmit={handleSubmit(this._handleSubmit)}>
        {avatarURL && <Image thumbnail src={avatarURL} />}
        <Input
          type="file"
          placeholder="Avatar"
          field={avatarWithoutValue}
        />
        <Form.Field>
          Store avatar into
          <div className="radio">
            <label>
              <input
                type="radio"
                {...storage}
                value="firebase"
                checked={avatarForm.storage.value === 'firebase'}
              /> Firebase
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                {...storage}
                value="local"
                checked={avatarForm.storage.value === 'local'}
              /> Local
            </label>
          </div>
        </Form.Field>
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
  avatarURL: PropTypes.string,
};

AvatarForm.contextTypes = {
  store: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'avatar',
  fields: [
    'avatar',
    'storage',
  ],
  initialValues,
  validate,
})(AvatarForm);
