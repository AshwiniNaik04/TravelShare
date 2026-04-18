const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');


// ---------------- GET PLACE BY ID ----------------
const getPlaceById = async (req, res, next) => {

  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError('Fetching place failed', 500)
    );
  }

  if (!place) {
    return next(
      new HttpError('Place not found', 404)
    );
  }

  res.json({
    place: place.toObject({ getters: true })
  });

};

// ---------------- LIKE PLACE ----------------

const likePlace = async (req, res, next) => {

  const placeId = req.params.pid;
  const userId = req.userData.userId;

  let place;

  try {

    place = await Place.findById(placeId);

  } catch (err) {

    return next(
      new HttpError(
        'Could not like/unlike place',
        500
      )
    );

  }

  if (!place) {

    return next(
      new HttpError(
        'Place not found',
        404
      )
    );

  }

  // TOGGLE LIKE LOGIC

  const alreadyLiked =
    place.likes.includes(userId);

  if (alreadyLiked) {

    // Unlike → remove user
    place.likes =
      place.likes.filter(
        id => id.toString() !== userId
      );

  } else {

    // Like → add user
    place.likes.push(userId);

  }

  try {

    await place.save();

  } catch (err) {

    return next(
      new HttpError(
        'Could not save like',
        500
      )
    );

  }

  res.json({
    likes: place.likes.length,
    liked: !alreadyLiked
  });

};

// ---------------- GET PLACES BY USER ----------------
const getPlacesByUserId = async (req, res, next) => {

  const userId = req.params.uid;

  let places;

  try {

    places = await Place.find({ creator: userId });

  } catch (err) {

    return next(
      new HttpError('Fetching places failed', 500)
    );

  }

  if (!places || places.length === 0) {

    return next(
      new HttpError(
        'No places found for this user',
        404
      )
    );

  }

  res.json({

    places: places.map(place => place.toObject({ getters: true })
    )

  });

};


// ---------------- CREATE PLACE ----------------
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file ? req.file.path : "",
    creator: req.userData.userId, // use auth user
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Creating place failed', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user', 404));
  }

  // Transaction: save place and update user
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating place failed', 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

// ---------------- UPDATE PLACE ----------------
const updatePlace = async (req, res, next) => {

  const {
    title,
    description,
    userId
  } = req.body;

  const placeId = req.params.pid;

  let place;

  try {

    place = await Place.findById(placeId);

  } catch (err) {

    return next(
      new HttpError(
        'Could not find place',
        500
      )
    );

  }

  if (!place) {

    return next(
      new HttpError(
        'Place not found',
        404
      )
    );

  }


  if (
    place.creator.toString() !== userId
  ) {

    return next(
      new HttpError(
        'Not allowed',
        403
      )
    );

  }


  place.title = title;
  place.description = description;


  try {

    await place.save();

  } catch (err) {

    return next(
      new HttpError(
        'Update failed',
        500
      )
    );

  }
  res.json({ place: place.toObject({ getters: true }) });
};


// ---------------- DELETE PLACE ----------------
const deletePlace = async (req, res, next) => {

  const placeId = req.params.pid;

  let place;

  try {

    place = await Place
      .findById(placeId)
      .populate('creator');

  } catch (err) {

    return next(
      new HttpError(
        'Could not find place.',
        500
      )
    );

  }

  if (!place) {

    return next(
      new HttpError(
        'Place not found.',
        404
      )
    );

  }

  // Permission check
  if (place.creator.id !== req.userData.userId) {

    return next(
      new HttpError(
        'You are not allowed to delete this place.',
        401
      )
    );

  }

  try {

    await place.deleteOne();

    // remove place from user
    place.creator.places.pull(place);
    await place.creator.save();

  } catch (err) {

    return next(
      new HttpError(
        'Could not delete place.',
        500
      )
    );

  }

  res.status(200).json({
    message: 'Deleted place successfully!.'
  });

};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId =
  getPlacesByUserId;

exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.likePlace = likePlace;