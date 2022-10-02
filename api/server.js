const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

mongoose
  .connect(
    `mongodb+srv://blunt17:bundy17@pawel.vs6xb.mongodb.net/travelFocusApp?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log('Backend is runningg');
      console.log('Connected to MongoDB');
    });
  })
  .catch((error) => {
    console.log(error);
  });
