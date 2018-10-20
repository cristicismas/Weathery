require('dotenv').load();
const request = require('request');

exports.getForecastWeather = async function(req, res, next) {
  try {
    request(`https://api.apixu.com/v1/forecast.json?key=${process.env.APIXU_API_KEY}&q=${req.params.query}&days=7`, function(err, response, body) {
      body = JSON.parse(body);

      if (err) {
        return next(err);
      } else if (response.statusCode === 400) {
        return next({
          status: 400,
          message: 'No matching location found.'
        });
      } else {
        const currentLocation = body.location;

        let data = [];

        data.push({
          city: currentLocation.name,
          region: currentLocation.region,
          country: currentLocation.country
        })

        for (let currentDayIndex = 0; currentDayIndex < 7; currentDayIndex++) {
          const currentDay = body.forecast.forecastday[currentDayIndex].day;

          const currentLoopData = {
            date: body.forecast.forecastday[currentDayIndex].date,
            maxtemp_c: currentDay.maxtemp_c,
            mintemp_c: currentDay.mintemp_c,
            maxtemp_f: currentDay.maxtemp_f,
            mintemp_f: currentDay.mintemp_f,
            avgtemp_c: currentDay.avgtemp_c,
            avgtemp_f: currentDay.avgtemp_f,
            wind_kph: currentDay.maxwind_kph,
            wind_mph: currentDay.maxwind_mph,
            precip_mm: currentDay.totalprecip_mm,
            precip_in: currentDay.totalprecip_in,
            avghumidity: currentDay.avghumidity,
            condition: currentDay.condition.text,
            condition_icon: currentDay.condition.icon
          };

          data.push(currentLoopData);
        }

        return res.status(200).json(data);
      }
    });
  } catch(err) {
    return next(err);
  }
}