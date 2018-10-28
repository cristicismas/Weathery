import React, { Component } from 'react';
import { ICONS } from '../constants/Icons';
import '../css/Navigation.css';

import Icon from './Icon';

class Navigation extends Component {
  componentDidMount() {
    // Adds smooth scroll on link click.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }
  render() {
    return (
      <div id='nav'>
        <a href="#weather-cards" className='nav-item'>
          <Icon icon={ICONS.WEATHER} size={64} color='#444' />
          <p>Weather</p>
        </a>

        <a href="#chart-container" className='nav-item'>
          <Icon icon={ICONS.CHART} size={64} color='#444' />
          <p>Chart</p>
        </a>

        <a href="#map" className='nav-item'>
          <Icon icon={ICONS.MAP} size={64} color='#444' />
          <p>Map</p>
        </a>
      </div>
    );
  }
}

export default Navigation;