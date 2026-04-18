const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


// ---------------- GET USERS ----------------

const getUsers = async (req, res, next) => {

  let users;

  try {

    users = await User.find({}, '-password');

  } catch (err) {

    return next(
      new HttpError(
        'Fetching users failed.',
        500
      )
    );

  }

  res.json({

    users: users.map(user =>
      user.toObject({ getters: true })
    )

  });

};



// ---------------- SIGNUP ----------------

const signup = async (req, res, next) => {


  /* console.log("BODY:", req.body);
  console.log("FILE:", req.file); */

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    console.log("Validation Errors:");
    console.log(errors.array());

    return res.status(422).json({
      message: "Invalid inputs passed.",
      errors: errors.array()
    });

  }


  const { name, email, password } = req.body;

  let existingUser;

  try {

    existingUser =
      await User.findOne({
        email: email
      });

  } catch (err) {

    return next(
      new HttpError(
        'Signup failed, please try again later!',
        500
      )
    );

  }


  if (existingUser) {

    return next(
      new HttpError(
        'User exists already, please login instead.',
        422
      )
    );

  }


  // HASH PASSWORD

  let hashedPassword;

  try {

    hashedPassword =
      await bcrypt.hash(password, 12);

  } catch (err) {

    return next(
      new HttpError(
        'Could not create user.',
        500
      )
    );

  }


  // HANDLE IMAGE

  let imagePath;

  if (req.file) {

    imagePath = req.file.path;

  } else {

    // Default image if none uploaded
    imagePath = "uploads/images/default.png";

  }


  const createdUser =
    new User({

      name: name,
      email: email,
      password: hashedPassword,
      image: req.file.path,
      places: []

    });


  try {

    await createdUser.save();

  } catch (err) {

    return next(
      new HttpError(
        'Signing up failed, please try again.',
        500
      )
    );

  }


  // CREATE TOKEN

  let token;

  try {

    token = jwt.sign(

      {

        userId: createdUser.id,
        email: createdUser.email

      },

      process.env.JWT_KEY,

      {
        expiresIn: '1h'
      }

    );

  } catch (err) {

    return next(
      new HttpError(
        'Signup failed.',
        500
      )
    );

  }


  res.status(201).json({

    userId: createdUser.id,
    email: createdUser.email,
    token: token

  });

};



// ---------------- LOGIN ----------------

const login = async (req, res, next) => {

  const { email, password } = req.body;

  let existingUser;

  try {

    existingUser =
      await User.findOne({
        email: email
      });

  } catch (err) {

    return next(
      new HttpError(
        'Login failed.',
        500
      )
    );

  }


  // If email not found

  if (!existingUser) {

    return next(
      new HttpError(
        'Invalid email! Try SignUp instead',
        401
      )
    );

  }


  // CHECK PASSWORD

  let isValidPassword = false;

  try {

    isValidPassword =
      await bcrypt.compare(
        password,
        existingUser.password
      );

  } catch (err) {

    return next(
      new HttpError(
        'Login failed.',
        500
      )
    );

  }

  // If password wrong
  if (!isValidPassword) {

    return next(
      new HttpError(
        'Incorrect Password!',
        401
      )
    );

  }

  if (!existingUser) {

    return next(
      new HttpError(
        'Invalid email',
        401
      )
    );

  }


  // CREATE TOKEN

  let token;

  try {

    token = jwt.sign(

      {

        userId: existingUser.id,
        email: existingUser.email

      },

      process.env.JWT_KEY,

      {
        expiresIn: '1h'
      }

    );

  } catch (err) {

    return next(
      new HttpError(
        'Login failed.',
        500
      )
    );

  }


  res.json({

    userId: existingUser.id,
    email: existingUser.email,
    token: token

  });

};



exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;