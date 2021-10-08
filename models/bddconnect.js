const mongoose = require('mongoose');
const connectionString = require('./connection_string')

const options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true
}

mongoose.connect(connectionString,
  options,
  function (err) {
    console.log(err);
  }
)
