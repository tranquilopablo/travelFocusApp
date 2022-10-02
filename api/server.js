const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');


const app = express();

app.use(bodyParser.json());


app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.listen(5000, () => {
  console.log('Backend is running!');
});
