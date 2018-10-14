import React, { Component } from 'react';
import Error from './Error';
import WeatherCards from './WeatherCards';
import '../css/Main.css';

class Main extends Component {
  render() {
    const { error, forecastWeather } = this.props;
    
    const currentLocation = forecastWeather[0];

    let formattedLocation = '';

    // Format location data
    if (currentLocation) {
      if (currentLocation.city) formattedLocation += `${currentLocation.city}, `;
      if (currentLocation.region) formattedLocation += `${currentLocation.region}, `;
      if (currentLocation.country) formattedLocation += `${currentLocation.country}`;
    }

    return (
      <section id='main'>
        <Error error={error} />

        <h2 className='location'>{formattedLocation}</h2>

        <WeatherCards forecastWeather={forecastWeather} />
      </section>
    );
  }
}

export default Main;