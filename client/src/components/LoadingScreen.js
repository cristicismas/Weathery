import React, { Component } from 'react';
import '../css/LoadingScreen.css';

class LoadingScreen extends Component {
  render() {
    return (
      <div className='loading-overlay'>
        <div className='loading-container'></div>
      </div>
    );
  }
}

export default LoadingScreen;