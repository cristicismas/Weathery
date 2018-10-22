import React, { Component } from 'react';
import Card from './Card';
import '../css/WeatherCard.css';

import { getDayName } from '../services/dayName.js';

class WeatherCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: []
    };
  }

  componentDidUpdate(prevProps) {
    const { formattedWeather } = this.props;

    let days = [];

    if (prevProps.formattedWeather !== formattedWeather) {

      for (let i = 0; i < formattedWeather.length; i++) {
        // Get day.
        const currentDate = formattedWeather[i].date;
        const dayName = getDayName(currentDate);

        // Get weather info.
        const minTemp = formattedWeather[i].mintemp;
        const maxTemp = formattedWeather[i].maxtemp;
        const wind = formattedWeather[i].wind;
        const precip = formattedWeather[i].precip;
        const humidity = formattedWeather[i].humidity;

        // Get condition and icon
        const condition = formattedWeather[i].condition;

        // Prefix url with 'https:' and change 64 res with 128.
        const conditionIconUrl = 'https:' + formattedWeather[i].condition_icon.replace(/64/g, '128');

        // Do this instead of pushing to the state's array because react's state should be immutable.
        days.push({
          dayName,
          maxTemp, 
          minTemp, 
          wind, 
          precip, 
          humidity,
          condition,
          conditionIconUrl
        });
      }

      this.setState({ days });
    }
  }

  render() {
    const { days } = this.state;

    const cardList = days.map(day => {
      return (
        <Card
          key={day.dayName}
          day={day.dayName}
          maxTemp={day.maxTemp}
          minTemp={day.minTemp}
          wind={day.wind}
          precip={day.precip}
          humidity={day.humidity}
          condition={day.condition}
          conditionIconUrl={day.conditionIconUrl} />
      );
    });

    return (
      <section id='weather-cards'>
        { cardList }
      </section>
    );
  }
}

export default WeatherCards;