import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import '../css/App.css';

import { apiCall } from '../services/api.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      userIp: '',
      forecastWeather: [],
    };

    this.changeGlobalState = this.changeGlobalState.bind(this);
    this.fetchForecastWeather = this.fetchForecastWeather.bind(this);
  }

  componentDidMount() {
    let defaultQuery = 'Paris';

    const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    const userIp = localStorage.getItem('userIp');

    if (userIp && ipRegex.test(userIp)) {
      defaultQuery = userIp;
      this.setState({ userIp });
    }

    this.fetchForecastWeather(defaultQuery);
  }

  changeGlobalState(newItemIdentifier, newItem) {
    this.setState({ [newItemIdentifier]: newItem });
  }

  fetchForecastWeather(query) {
    apiCall('get', `forecast_weather/${query}`)
      .then(res => {
        this.setState({ forecastWeather: res });
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  }

  render() {
    return (
      <div className='App'>
        <Header 
          changeGlobalState={this.changeGlobalState}
          fetchForecastWeather={this.fetchForecastWeather} />

        <Main changeGlobalState={this.changeGlobalState} {...this.state} />
      </div>
    );
  }
}

export default App;