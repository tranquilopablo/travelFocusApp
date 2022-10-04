const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');

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

////////////////////////////////////////////////////////////////////
// REGISTER
router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(
        'Nieprawidłowe dane przeszły, proszę sprawdż dane.'
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

    const createdUser = new User({
      name,
      email,
      image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
      password: hashedPassword,
      places: [],
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new Error(
        'Rejestracja się nie udała, proszę spróbuj ponownie.'
      );
      error.code = 500;
      return next(error);
    }

    const userObject = createdUser.toObject({ getters: true });

    res.status(201).json({
      user: {
        userId: userObject.id,
        email: userObject.email,
        image: userObject.image,
      },
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

  res.json({
    user: {
      userId: userObject.id,
      email: userObject.email,
      image: userObject.image,
    },
  });
});

//UPDATE USER
router.patch('/:uid', async (req, res, next) => {
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

  // here it would be good to check whether we are allowed to update user
  //  if (updatedUser.toObject({ getters: true }).id !== userId ;

  updatedUser.name = name;
  updatedUser.email = email;
  updatedUser.password = hashedPassword;
  updatedUser.image =
    'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg';

  try {
    await updatedUser.save();
  } catch (err) {
    const error = new Error('Something went wrong,could not update user.');
    error.code = 500;
    return next(error);
  }

  const userObject = updatedUser.toObject({ getters: true });

  res.status(200).res.json({
    user: {
      userId: userObject.id,
      email: userObject.email,
      image: userObject.image,
    },
  });
});

//DELETE USER
router.patch('/:uid', async (req, res, next) => {});

module.exports = router;
