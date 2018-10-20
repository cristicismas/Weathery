const express = require('express');
const router = express.Router({ mergeParams: true });

const { getForecastWeather } = require('../handlers/weather');

router.route('/forecast_weather/:query')
  .get(getForecastWeather);

module.exports = router;