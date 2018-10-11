import React, { Component } from 'react';
import '../css/Error.css';

class Error extends Component {
  render() {
    const { error } = this.props;
    if (error) {
      return (
        <div className="error-container">
          <p className="error">{error}</p>
        </div>
      );
    } else {
      return null
    }
  }
}

export default Error;