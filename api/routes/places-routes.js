const express = require('express');
const router = express.Router();



let DUMMY_PLACES = [
    
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrappers in the world!',
        location: {
            lat: 40.7484474,
            lgn: -73.9871516,
        },
        addresss: '20 W 34th St, New York, NY 10001',
        creator: 'u1',
    },
]

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
