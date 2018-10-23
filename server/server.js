require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const errorHandler = require('./handlers/error.js');
const weatherRoutes = require('./routes/weather');

const app = express();
const port = process.env.PORT || 5000;

let corsOrigin = 'https://cristicismas.github.io';

if (process.env.NODE_ENV !== 'production') {
  corsOrigin = 'http://localhost:3000';
}

app.use(cors({ origin: corsOrigin }));
app.use(bodyParser.json());

app.use('/api', weatherRoutes);

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
