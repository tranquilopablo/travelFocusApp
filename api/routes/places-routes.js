const express = require('express');
const router = express.Router();

// GET PLACE BY PLACE ID
router.get('/:pid', async (req, res, next) => {});

// GET PLACES BY USER ID
router.get('/user/:uid', async (req, res, next) => {});

// CREATE PLACE
router.post('/', async (req, res, next) => {});

// UPDATE PLACE
router.patch('/:pid',async (req, res, next) => {});

// DELETE PLACE
router.delete('/:pid', async (req, res, next) => {});

module.exports = router;
