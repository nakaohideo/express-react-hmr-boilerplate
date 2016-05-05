import crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import credentials from '../../../config/credentials';

const hashPassword = (rawPassword = '') => {
  let recursiveLevel = 5;
  while (recursiveLevel) {
    rawPassword = crypto
      .createHash('md5')
      .update(rawPassword)
      .digest('hex');
    recursiveLevel -= 1;
  }
  return rawPassword;
};

let User = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: hashPassword,
  },
}, {
  versionKey: false,
});

User.methods.auth = function(password, cb) {
  const isAuthenticated = (this.password === hashPassword(password));
  cb(null, isAuthenticated);
};

User.methods.toJwtToken = function(cb) {
  const user = {
    _id: this._id,
    name: this.name,
    email: this.email,
  };
  const token = jwt.sign(user, credentials.jwt.secret, {
    expiresIn: credentials.jwt.expiresIn,
  });
  return token;
};

User.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', User);
