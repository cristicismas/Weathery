import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { getDayName } from '../services/dayName.js';

class TemperatureChart extends Component {
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
    const { days, temperatures } = this.state;

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
      <div className='chart-container'>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  }
}

export default TemperatureChart;