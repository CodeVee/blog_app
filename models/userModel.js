const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserModel = new Schema({
  id: ObjectId,
  created_at: Date,
  firstname: { type: String,  },
  lastname: { type: String, },
  email: { type: String, unique: true},
  password: { type: String, required: true },
  username: {type: String, required: true, unique: true}
});

UserModel.pre(
  'save',
  async function (next) {
      const user = this;
      const rounds = 10;
      const hash = await bcrypt.hash(user.password, rounds);

      this.password = hash;
      next();
  }
);

UserModel.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return true;
}

const User = mongoose.model('Users', UserModel);

module.exports = User;
