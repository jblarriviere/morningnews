const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
});

module.exports = mongoose.model('users', userSchema);