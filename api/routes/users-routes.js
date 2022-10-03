const express = require('express');
const router = express.Router();

// GET ALL USERS
router.get('/',async (req, res, next) => {
  return res.json({ message: 'It worksss' });
});

// REGISTER
router.post('/signup', async (req, res, next) => {});

// LOGIN
router.post('/login', async (req, res, next) => {});

//UPDATE USER
router.patch('/:uid', async (req, res, next) => {});

//DELETE USER
router.patch('/:uid', async (req, res, next) => {});

module.exports = router;
