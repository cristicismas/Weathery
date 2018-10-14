import React, { Component } from 'react';
import Error from './Error';
import WeatherCards from './WeatherCards';
import '../css/Main.css';

import { Line } from 'react-chartjs-2';
import { getDayName } from '../services/dayName.js';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [],
      temperatures: []
    };
  }

  componentDidUpdate(prevProps) {
    const { forecastWeather } = this.props;

    let days = [];
    let temperatures = [];

    if (prevProps.forecastWeather !== forecastWeather) {

      // Starts from 1 because forecastWeather[0] has location info.
      for (let i = 1; i < 8; i++) {
        // Get day.
        const currentDate = forecastWeather[i].date;
        const dayName = getDayName(currentDate);

        // Get temperature.
        const avgTemp = forecastWeather[i].avgtemp_c;

        days.push(dayName);
        temperatures.push(avgTemp);
      }

      this.setState({ days, temperatures });
    }
  }

  render() {
    const { error, forecastWeather } = this.props;
    const { days, temperatures } = this.state;
    
    const currentLocation = forecastWeather[0];

    let formattedLocation = '';

    // Format location data
    if (currentLocation) {
      if (currentLocation.city) formattedLocation += `${currentLocation.city}, `;
      if (currentLocation.region) formattedLocation += `${currentLocation.region}, `;
      if (currentLocation.country) formattedLocation += `${currentLocation.country}`;
    }

    // Get chart data
    const chartData = {
      labels: days,
      datasets: [
        {
          label: 'Temperature',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: '#227df4',
          borderWidth: 2,
          data: temperatures
        }
      ]
    };

    const chartOptions = {
      hover : { mode: null },
      elements: {
        line: {
          tension: 0
        }
      }
    };

    return (
      <section id='main'>
        <Error error={error} />

        <h2 className='location'>{formattedLocation}</h2>

        <WeatherCards forecastWeather={forecastWeather} />

        <div className='flex-container'>
          <div className='chart-container'>
            <Line data={chartData} options={chartOptions} />
          </div>

          <div></div>
        </div>
      </section>
    );
  }
}

export default Main;