const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.listen(5000, () => {
  console.log('Backend is runningg');
});
