const express = require('express');
const { check } = require('express-validator');

const usersController =
  require('../controllers/users-controller');

const fileUpload =
  require('../middleware/file-upload');

const router = express.Router();


// ---------------- GET USERS ----------------

router.get(
  '/',
  usersController.getUsers
);


// ---------------- SIGNUP ----------------

router.post(
  '/signup',

  // 📸 Image Upload Middleware
  fileUpload.single('image'),

  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required'),

    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Enter valid email'),

    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
  ],

  usersController.signup
);


// ---------------- LOGIN ----------------

router.post(
  '/login',
  [
    check('email')
      .normalizeEmail()
      .isEmail(),

    check('password')
      .not()
      .isEmpty()
  ],
  usersController.login
);


module.exports = router;