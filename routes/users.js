var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const uid2 = require('uid2');
const validator = require('validator');

const UserModel = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', async function (req, res, next) {

  let result = false;
  let errors = [];
  let savedUser = {};

  let emailInDb = await UserModel.findOne({
    email: req.body.email
  })
  let usernameInDb = await UserModel.findOne({
    username: req.body.username
  })

  if (emailInDb) {
    result = false;
    errors.push('Email belongs to an existing account');
  } else if (usernameInDb) {
    result = false;
    errors.push('Username already exists');
  } else if (!validator.isEmail(req.body.email)) {
    result = false;
    errors.push('Email is not valid');
  } else if (!validator.isStrongPassword(req.body.password)) {
    result = false;
    if (req.body.password.length < 8) {
      errors.push('Password must be more than 8 characters long');
    }
    if (req.body.password.toLowerCase() === req.body.password) {
      errors.push('Password must include 1 uppercase letter');
    }
    if (req.body.password.toUpperCase() === req.body.password) {
      errors.push('Password must include 1 lowercase letter');
    }
    if (!req.body.password.match(/[@$!%*?&]/)) {
      errors.push('Password must include 1 special character (@$!%*?&)');
    }
  }

  if (errors.length === 0) {

    const hash = bcrypt.hashSync(req.body.password, 10);
    let newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      token: uid2(32)
    });
    savedUser = await newUser.save();

    if (savedUser) {
      result = true;
    }
  }
  res.json({ result, token: savedUser.token, errors });

});

router.post('/sign-in', async function (req, res, next) {

  let result = false;
  let errors = [];
  let token = '';

  let user = await UserModel.findOne({
    email: req.body.email,
  })

  if (!user) {
    result = false;
    errors.push('Invalid email')
  } else if (!bcrypt.compareSync(req.body.password, user.password)) {
    result = false;
    errors.push('Invalid password')
  } else {
    result = true;
    token = user.token;
  }

  res.json({ result, token, errors });

});

module.exports = router;
