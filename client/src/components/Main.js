import React, { Component } from 'react';
import Error from './Error';
import Switch from './Switch';
import WeatherCards from './WeatherCards';
import TemperatureChart from './TemperatureChart';
import Map from './Map';
import '../css/Main.css';


class Main extends Component {
  constructor(props) {
    super(props);

    let isMetric = true;

    // Check localStorage for last isMetric value
    // Compares with string because that's how values are stored in localStorage
    if (localStorage.getItem('isMetric') === 'false') {
      isMetric = false;
    }

    this.state = { 
      formattedWeather: [],
      isMetric 
    };

    this.formatWeather = this.formatWeather.bind(this);
    this.changeSystem = this.changeSystem.bind(this);
  }

  componentDidMount() {
    this.formatWeather();
  }

  componentDidUpdate(prevProps, prevState) {
    const isWeatherFetched = prevProps.forecastWeather.length !== this.props.forecastWeather.length;
    const isSystemDifferent = prevState.isMetric !== this.state.isMetric;
    
    const isLocationDifferent = 
      prevProps.forecastWeather.length ? 
      prevProps.forecastWeather[0].city !== this.props.forecastWeather[0].city : 
      false;

    if (isWeatherFetched || isSystemDifferent || isLocationDifferent) {
      this.formatWeather();
    }
  }

  formatWeather() {
    const { isMetric } = this.state;
    const { forecastWeather } = this.props;

    let formattedWeather = [];

    // Starts from 1 because forecastWeather[0] has location info
    for (let i = 1; i < forecastWeather.length; i++) {
      const currentLoopWeather = forecastWeather[i];

      if (isMetric) {
        formattedWeather.push({
          date: currentLoopWeather.date,
          mintemp: currentLoopWeather.mintemp_c,
          maxtemp: currentLoopWeather.maxtemp_c,
          avgtemp: currentLoopWeather.avgtemp_c,
          wind: currentLoopWeather.wind_kph,
          precip: currentLoopWeather.precip_mm,
          humidity: currentLoopWeather.avghumidity,
          condition: currentLoopWeather.condition,
          condition_icon: currentLoopWeather.condition_icon
        });
      } else {
        formattedWeather.push({
          date: currentLoopWeather.date,
          mintemp: currentLoopWeather.mintemp_f,
          maxtemp: currentLoopWeather.maxtemp_f,
          avgtemp: currentLoopWeather.avgtemp_f,
          wind: currentLoopWeather.wind_mph,
          precip: currentLoopWeather.precip_in,
          humidity: currentLoopWeather.avghumidity,
          condition: currentLoopWeather.condition,
          condition_icon: currentLoopWeather.condition_icon
        });
      }
    }

    this.setState({ formattedWeather });
  }

  changeSystem(isMetric) {
    localStorage.setItem('isMetric', isMetric);
    this.setState({ isMetric });
  }

  render() {
    const { isMetric, formattedWeather } = this.state;
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
        
        <Switch isToggled={isMetric} changeToggledValue={this.changeSystem} />

        <h2 className='location'>{formattedLocation}</h2>

        <WeatherCards formattedWeather={formattedWeather} />

        <div className='flex-container'>
          <TemperatureChart formattedWeather={formattedWeather} />
          <Map changeGlobalState={this.props.changeGlobalState} forecastWeather={forecastWeather} {...this.props} />
        </div>

      </section>
    );
  }
}

export default Main;