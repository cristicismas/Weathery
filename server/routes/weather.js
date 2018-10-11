const express = require('express');
const router = express.Router({ mergeParams: true });

const { getCurrentWeather, getForecastWeather } = require('../handlers/weather');

router.route('/current_weather/:query')
  .get(getCurrentWeather);

router.route('/forecast_weather/:query')
  .get(getForecastWeather);

module.exports = router;