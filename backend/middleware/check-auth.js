const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {


    if (req.method === 'OPTIONS') {
      return next();
    }

    // Check authorization header exists
    if (!req.headers.authorization) {
      throw new Error('Authentication failed!');
    }

    // Extract token
    const token =
      req.headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('Authentication failed!');
    }

    // Verify token
    const decodedToken =
      jwt.verify(
        token,
        process.env.JWT_KEY
      );

    // Attach user data
    req.userData = {
      userId: decodedToken.userId
    };

    next();

  } catch (err) {

    return next(
      new HttpError(
        'Authentication failed!',
        401
      )
    );

  }

};