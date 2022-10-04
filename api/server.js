const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, '/images')));

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new Error('Could not find this route');
  error.code = 404;
  throw error;
});

// middleware for handling errors in express
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
mongoose
.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pawel.vs6xb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
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