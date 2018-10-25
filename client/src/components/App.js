import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import '../css/App.css';

import { DEFAULTS } from '../constants/Defaults.js';

import { fetchForecastWeather } from '../services/forecastWeather.js';
import { setCoordinatesByLocation } from '../services/coordinates.js';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      userIp: '',
      forecastWeather: [],
      lat: DEFAULTS.LAT,
      lng: DEFAULTS.LNG
    };

    this.changeGlobalState = this.changeGlobalState.bind(this);
  }

  componentWillMount() {
    axios.get(`https://api.ipify.org?format=json`).then(json => {
      localStorage.setItem('userIp', json.data.ip);
    });
  }

  componentDidMount() {
    let defaultQuery = localStorage.getItem('lastLocation') || DEFAULTS.LOCATION;

    const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    const userIp = localStorage.getItem('userIp');

    if (userIp && ipRegex.test(userIp)) {
      defaultQuery = userIp;
    }

    fetchForecastWeather(defaultQuery).then(forecastWeather => {
      const newLocation = Object.values(forecastWeather[0]).join(', ');
      
      setCoordinatesByLocation(newLocation, this).then(coordinates => {
        this.setState({ 
          forecastWeather: forecastWeather, 
          lat: coordinates.newLat,
          lng: coordinates.newLng,
          error: ''
        });
      });
    }).catch(err => {
      this.setState({ error: err });
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { forecastWeather } = this.state;
    const defaultLocation = localStorage.getItem('lastLocation') || DEFAULTS.LOCATION;

    const prevLocation = prevState.forecastWeather.length ? Object.values(prevState.forecastWeather[0]).join(', ') : defaultLocation;
    const currentLocation = forecastWeather.length ? Object.values(forecastWeather[0]).join(', ') : defaultLocation;

    if (prevLocation !== currentLocation) {
      this.forceUpdate();
    }
  }

  changeGlobalState(itemIdentifier, newItem) {
    this.setState({ [itemIdentifier]: newItem });
  }

  render() {
    return (
      <div className='App'>
        <Header 
          changeGlobalState={this.changeGlobalState} />

        <Main 
          changeGlobalState={this.changeGlobalState} 
          {...this.state} />

        <Footer />
      </div>
    );
  }
}

export default App;