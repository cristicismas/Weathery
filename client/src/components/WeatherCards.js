import React, { Component } from 'react';
import Card from './Card';
import '../css/WeatherCard.css';

class WeatherCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: []
    };
  }

  componentDidUpdate(prevProps) {
    const { forecastWeather } = this.props;

    let days = [];

    if (prevProps.forecastWeather !== forecastWeather) {

      // Starts from 1 because forecastWeather[0] has location info.
      for (let i = 1; i < 8; i++) {
        // Get day.
        const currentDate = forecastWeather[i].date;
        const dayName = this.getDayName(currentDate);

        // Get weather info.
        const minTemp = forecastWeather[i].mintemp_c;
        const maxTemp = forecastWeather[i].maxtemp_c;
        const wind = forecastWeather[i].wind_kph;
        const precip = forecastWeather[i].precip_mm;
        const humidity = forecastWeather[i].avghumidity;

        // Get condition and icon
        const condition = forecastWeather[i].condition;

        // Prefix url with 'https:' and change 64 res with 128.
        const conditionIconUrl = 'https:' + forecastWeather[i].condition_icon.replace(/64/g, '128');

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

  getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
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