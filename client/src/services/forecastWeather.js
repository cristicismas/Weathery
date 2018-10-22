import { apiCall } from '../services/api.js';

export function fetchForecastWeather(query) {
  return new Promise((resolve, reject) => {
    apiCall('get', `forecast_weather/${query}`)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.message);
      });
  });
}