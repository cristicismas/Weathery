import React, { Component } from 'react';
import Icon from './Icon';
import '../css/Header.css';

import { ICONS } from '../constants/Icons.js';

import { fetchForecastWeather } from '../services/forecastWeather.js';
import { setCoordinatesByLocation } from '../services/coordinates.js';

class Header extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  // Animate search bar.
  onSearchClick(e) {
    const bigScreen = window.matchMedia('(min-width: 800px)');

    const elementWidth = e.target.style.width;

    if (elementWidth !== '400px' && bigScreen.matches) {
      e.target.style.width = '400px';
      e.target.style.cursor = 'text';
      e.target.style.paddingLeft = '25px';
      e.target.style.paddingRight = '50px';
      
      const submitButton = document.getElementById('search-btn');
      submitButton.style.zIndex = 10;
    }
  }

  // Search for given query
  onSubmit(e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');

    if (searchInput.value.trim()) {
      const searchQuery = searchInput.value;

      // Fetch weather by new query.
      fetchForecastWeather(searchQuery).then(forecastWeather => {
        const newLocation = Object.values(forecastWeather[0]).join(', ');
        localStorage.setItem('lastLocation', newLocation);

        // Set location coordinates in global state.
        setCoordinatesByLocation(newLocation, this.props).then(coordinates => {
          this.props.changeGlobalState('forecastWeather', forecastWeather);
          this.props.changeGlobalState('lat', coordinates.newLat);
          this.props.changeGlobalState('lng', coordinates.newLng);
  
          // Reset error.
          this.props.changeGlobalState('error', '');
        });
      }).catch(err => this.props.changeGlobalState('error', err));

      // Reset Input Field.
      searchInput.value = '';
    } else {
      this.props.changeGlobalState('error', 'Please write something in the search bar before attempting to search.');
    }
  }

  render() {
    return (
      <section id='header'>
        <form id='search-form'>
          <h1 id='header-title'>Weathery</h1>

          <div className='container'>
            <input id='search-input' type='text' onClick={this.onSearchClick} placeholder='City name, zip / postal / postcode or IP address.' />

            <input type='submit' id='search-btn' value='' onClick={this.onSubmit} />
            <Icon icon={ICONS.SEARCH} color='#333' size='40' />
          </div>
        </form>
      </section>
    );
  }
}

export default Header;