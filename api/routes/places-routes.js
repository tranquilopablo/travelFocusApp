const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
const randomId = uuidv4();

///////////////////////////////////////////////////////////////////////////////
// GET PLACE BY PLACE ID
router.get('/:pid', async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new Error('Nieudana próba znalezienia miejsca.');
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
    const error = new Error('Nieudana próba pobrania miejsc, spróbuj ponownie');
    error.code = 500;
    return next(error);
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
});

/////////////////////////////////////////
router.use(checkAuth);

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
      const error = new Error('Niepoprawne dane, sprawdź i popraw.');
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

    const params = {
      Bucket: bucketName,
      Key: `${req.file.originalname}${randomId}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    // const newCommand = new GetObjectCommand({
    //   Bucket: bucketName,
    //   Key: params.Key,
    // });

    // const url = await getSignedUrl(s3, newCommand, { expiresIn: 3600 });

    const workingUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}${randomId}`;

    const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: workingUrl,
      creator,
      priority,
      status,
      done: false,
    });

    // image: req.file.path,
    // image: req.file.buffer,

    let user;
    try {
      user = await User.findById(creator);
    } catch (err) {
      const error = new Error('Próba stworzenia miejsca nieudana, spróbuj ponownie.');
      error.code = 500;
      return next(error);
    }

    if (!user) {
      const error = new Error('Nie można znależć użytkownika dla podanego id.');
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
      const error = new Error('Próba stworzenia miejsca nieudana, spróbuj ponownie.');
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
  fileUpload.single('image'),
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Niepoprawne dane, sprawdź i popraw.');
      error.code = 422;
      return next(error);
    }

    const { title, description, address, priority, status, done, creator } =
      req.body;
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
      const error = new Error('Coś nie tak, nieudana próba edycji miejsca.');
      error.code = 500;
      return next(error);
    }

    // checking whether we are allowed to update place
    if (updatedPlace.creator.toString() !== creator) {
      const error = new Error(
        'Nie jesteś uprawniony do edytowania tego miejsca.'
      );
      error.code = 401;
      return next(error);
    }

    let workingUrl;
    if (req.file) {
      const params = {
        Bucket: bucketName,
        Key: `${req.file.originalname}${randomId}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);

      await s3.send(command);

      workingUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}${randomId}`;
    }


    updatedPlace.title = title;
    updatedPlace.description = description;
    updatedPlace.address = address;

    updatedPlace.location = coordinates;
    updatedPlace.priority = priority;
    updatedPlace.status = status;
    updatedPlace.done = done;

    if (req.file) {
      // updatedPlace.image = req.file.path;
      updatedPlace.image = workingUrl;
    }

    try {
      await updatedPlace.save();
    } catch (err) {
      const error = new Error('Coś nie tak, nieudana próba edycji miejsca.');
      error.code = 500;
      return next(error);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
  }
);
/////////////////////////////////////////////////////////////////////////////////////////////
// DELETE PLACE
router.delete('/:pid/:uid', async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.params.uid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new Error('Coś nie tak, nieudana próba usunięcia miejsca.');
    error.code = 500;
    return next(error);
  }

  if (!place) {
    const error = new Error('Nie można znależć miejsca dla podanego id.');
    error.code = 404;
    return next(error);
  }

  // checking whether we are allowed to delete place. We check throught id because in this case when we used populate methood above we have got full user object after place.creator. But actually thanks to that we dont need to use method toString()
  if (place.creator._id.toString() !== userId) {
    const error = new Error('Nie jesteś uprawniony do usunięcia tego miejsca.');
    error.code = 401;
    return next(error);
  }

  // const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('Coś nie tak, nieudana próba usunięcia miejsca.');
    error.code = 500;
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: 'Miejsce usunięto.' });
});

module.exports = router;
