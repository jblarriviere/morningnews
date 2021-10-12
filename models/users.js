const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles'
  }],
  readlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles'
  }],
  selectedCountry: String
});

module.exports = mongoose.model('users', userSchema);