import React, { Component } from 'react';
import '../css/Footer.css';

class Footer extends Component {
  render() {
    return (
      <section id='footer'>
        <p>Weather data from <a href='https://www.apixu.com/' target='_blank'>APIXU</a></p>
        <p>Made by <a href='https://cristicismas.github.io/' target='_blank'>Cristi Cismas</a></p>
      </section>
    );
  }
}

export default Footer;