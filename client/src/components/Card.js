import React, { Component } from 'react';
import '../css/Card.css';

class Card extends Component {
  render() {
    const { day, maxTemp, minTemp, wind, precip, humidity, condition, conditionIconUrl } = this.props;

    return (
      <div className='card'>
        <h3 className='day-name'>{day}</h3>
        <img className='card-img' src={conditionIconUrl} alt={condition} />

        <h3 className='temp-range'>{minTemp}&#176; / {maxTemp}&#176;</h3>

        <div className='weather-info'>
          <div className='wind'><span>Wind:</span> <span className='weather-value'>{wind}</span></div>
          <div className='precip'><span>Precipitations:</span> <span className='weather-value'>{precip}</span></div>
          <div className='hum'><span>Humidity:</span> <span className='weather-value'>{humidity}</span></div>
        </div>
      </div>
    );
  }
}

export default Card;