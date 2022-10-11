const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const fs = require('fs');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');
const User = require('../models/user');
const Place = require('../models/place');

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

/////////////////////////////////////////////////////////////////
// GET ALL USERS
router.get('/', async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new Error("'Fetching users failed,please try again later.'");
    error.code = 500;
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});

//////////////////////////////////////////////////////////////////////
// GET USER BY ID

router.get('/:uid', async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new Error('Something went wrong, could not find a user');
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error('Nie znaleziono tego użytkownika');
    error.code = 404;
    return next(error);
  }

  // res.json({ user: user.toObject({ getters: true }) });

  res.status(201).json({
    userId: user.id,
    email: user.email,
    image: user.image,
    name: user.name,
  });
});

////////////////////////////////////////////////////////////////////
// REGISTER
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        'Nieprawidłowe dane przeszły, proszę sprawdź dane.'
      );
      error.code = 422;
      return next(error);
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new Error(
        'Rejestracja się nie udała, proszę spróbuj ponownie'
      );
      error.code = 500;
      return next(error);
    }

    if (existingUser) {
      const error = new Error(
        'Użytkownik o podanym emailu już istnieje. Proszę zaloguj się w takim razie. '
      );
      error.code = 422;
      return next(error);
    }

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new Error('Could not create user, please try again');
      error.code = 500;
      return next(error);
    }

    const params = {
      Bucket: bucketName,
      Key: `${req.file.originalname}${randomId}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    console.log(params.Key);

    const command = new PutObjectCommand(params);

    await s3.send(command);

    // const newCommand = new GetObjectCommand({
    //   Bucket: bucketName,
    //   Key: params.Key,
    // });

    // const url = await getSignedUrl(s3, newCommand, { expiresIn: 3600 });

    const workingUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}${randomId}`;

    const createdUser = new User({
      name,
      email,
      image: workingUrl,
      password: hashedPassword,
      places: [],
    });
    // image: req.file.path,

    try {
      await createdUser.save();
    } catch (err) {
      const error = new Error(
        'Rejestracja się nie udała, proszę spróbuj ponownie.'
      );
      error.code = 500;
      return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_KEY,
        { expiresIn: '2h' }
      );
    } catch (err) {
      const error = new Error(
        'Rejestracja się nie udała, proszę spróbuj ponownie.'
      );
      error.code = 500;
      return next(error);
    }

    res.status(201).json({
      userId: createdUser.id,
      email: createdUser.email,
      image: createdUser.image,
      token: token,
    });
  }
);

////////////////////////////////////////////////////////////////////////
// LOGIN
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new Error('Logowanie się nie udało, proszę spróbuj ponownie');
    error.code = 500;
    return next(error);
  }

  if (!existingUser) {
    const error = new Error('Podane dane do logowania są nieprawidłowe ');
    error.code = 403;
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new Error('Nie można zalogować, sprawdż poprawność danych.');
    error.code = 500;
    return next(error);
  }
  if (!isValidPassword) {
    const error = new Error('Nie można zalogować, sprawdż poprawność danych.');
    error.code = 403;
    return next(error);
  }

  const userObject = existingUser.toObject({ getters: true });

  let token;
  try {
    token = jwt.sign(
      { userId: userObject.id, email: userObject.email },
      process.env.JWT_KEY,
      { expiresIn: '2h' }
    );
  } catch (err) {
    const error = new Error(
      'Logowanie się nie udało, proszę spróbuj ponownie.'
    );
    error.code = 500;
    return next(error);
  }

  res.json({
    userId: userObject.id,
    email: userObject.email,
    image: userObject.image,
    token: token,
  });
});

/////////////////////////////////////////
router.use(checkAuth);

////////////////////////////////////////////////////////////////////////
//UPDATE USER
router.patch(
  '/:uid',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Invalid inputs passed, please check your data.');
      error.code = 422;
      return next(error);
    }

    const { name, email, password } = req.body;
    const userId = req.params.uid;

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new Error('Could not update user, please try again');
      error.code = 500;
      return next(error);
    }

    let updatedUser;
    try {
      updatedUser = await User.findById(userId);
    } catch (err) {
      const error = new Error('Something went wrong,could not update user.');
      error.code = 500;
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

    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.password = hashedPassword;

    if (req.file) {
      // updatedUser.image = req.file.path;
      updatedUser.image = workingUrl;
    }

    try {
      await updatedUser.save();
    } catch (err) {
      const error = new Error('Something went wrong,could not update user.');
      error.code = 500;
      return next(error);
    }

    const userObject = updatedUser.toObject({ getters: true });

    res.status(200).json({
      userId: userObject.id,
      email: userObject.email,
      image: userObject.image,
    });
  }
);

//////////////////////////////////////////////////////////////////////////
//DELETE USER
router.delete('/:uid', async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new Error('Something went wrong,could not delete user.');
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error('Could not find user for this id');
    error.code = 404;
    return next(error);
  }

  const imagePath = user.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.remove({ session: sess });
    await Place.deleteMany({ creator: userId }).session(sess);
    await sess.commitTransaction();
  } catch (err) {
    const error = new Error('Something went wrong, could not delete userr');
    error.code = 500;
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: 'Deleted user' });
});

module.exports = router;
