const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const fs = require('fs');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const fileUpload = require('../middleware/file-upload');

///////////////////////////////////////////////////////////////////////////////
// GET PLACE BY PLACE ID
router.get('/:pid', async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new Error('Something went wrong, could not find a place');
    error.code = 500;
    return next(error);
  }

  if (!place) {
    const error = new Error('Nie znaleziono tego miejsca');
    error.code = 404;
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
});
//////////////////////////////////////////////////////////////////////////////////////////
// GET PLACES BY USER ID
router.get('/user/:uid', async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new Error('Fetching places failed, please try again later');
    error.code = 500;
    return next(error);
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
});
/////////////////////////////////////////////////////////////////////////////////////////
// CREATE PLACE
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid inputs passed, please check your data.');
      error.code = 422;
      throw error;
    }

    const { title, description, address, creator, priority, status } = req.body;

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
      image: req.file.path,
      creator,
      priority,
      status,
      done: false,
    });

    let user;
    try {
      user = await User.findById(creator);
    } catch (err) {
      const error = new Error('Creating place failed, please try again.');
      error.code = 500;
      return next(error);
    }

    if (!user) {
      const error = new Error('Could not find user for provided id');
      error.code = 404;
      return next(error);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({ session: sess });
      user.places.push(createdPlace);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new Error('Creating place failed, please try again');
      error.code = 500;
      return next(error);
    }

    res.status(201).json({ place: createdPlace });
  }
);
/////////////////////////////////////////////////////////////////////////////////////////
// UPDATE PLACE
router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid inputs passed, please check your data.');
      error.code = 422;
      return next(error);
    }

    const { title, description, address, priority, status, done } = req.body;
    const placeId = req.params.pid;
    

    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

    let updatedPlace;

    try {
      updatedPlace = await Place.findById(placeId);
    } catch (err) {
      const error = new Error('Something went wrong,could not update place.');
      error.code = 500;
      return next(error);
    }

    // here it would be good to check whether we are allowed to update place
    //  if (updatedPlace.creator.toString() !== req.userid )

    updatedPlace.title = title;
    updatedPlace.description = description;
    updatedPlace.address = address;

    updatedPlace.location = coordinates;
    updatedPlace.priority = priority;
    updatedPlace.status = status;
    updatedPlace.done = done;

    if (req.file) {
      updatedPlace.image = req.file.path;
    }

    try {
      await updatedPlace.save();
    } catch (err) {
      const error = new Error('Something went wrong,could not update place.');
      error.code = 500;
      return next(error);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
  }
);
/////////////////////////////////////////////////////////////////////////////////////////////
// DELETE PLACE
router.delete('/:pid', async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new Error('Something went wrong,could not delete place.');
    error.code = 500;
    return next(error);
  }

  if (!place) {
    const error = new Error('Could not find place for this id');
    error.code = 404;
    return next(error);
  }

  // here it would be good to check whether we are allowed to delete place
  //  if (place.creator.id !== req.userId)

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('Something went wrong, could not delete place');
    error.code = 500;
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place' });
});

module.exports = router;
