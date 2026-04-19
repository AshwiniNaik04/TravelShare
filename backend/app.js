require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const placesRoutes =
  require('./routes/places-routes');

const usersRoutes =
  require('./routes/users-routes');

const HttpError =
  require('./models/http-error');

const app = express();


// Parse JSON
app.use(bodyParser.json());


// Serve uploaded images
app.use(
  '/uploads/images',
  express.static(
    path.join('uploads', 'images')
  )
);


// CORS Middleware
app.use((req, res, next) => {

  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE'
  );

  next();

});


// Routes
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


// Route Not Found Handler
app.use((req, res, next) => {

  const error =
    new HttpError(
      'Could not find this route',
      404
    );

  throw error;

});


// Error Middleware
app.use((error, req, res, next) => {

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);

  res.json({
    message:
      error.message ||
      'An unknown error occurred!'
  });

});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {

    console.log("DB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  })
  .catch(err => {

    console.log(
      "DB Connection Failed:",
      err
    );

  });