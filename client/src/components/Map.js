import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import { fetchForecastWeather } from '../services/forecastWeather.js';
import { setCoordinatesByLocation } from '../services/coordinates.js';

import { DEFAULTS } from '../constants/Defaults.js';

class Map extends Component {
  constructor(props) {
    super(props);

    this.onMapClick = this.onMapClick.bind(this);
  }

  componentDidMount() {
    const defaultLocation = localStorage.getItem('lastLocation') || DEFAULTS.LOCATION;

    setCoordinatesByLocation(defaultLocation, this.props).then(coordinates => {
      this.props.changeGlobalState('lat', coordinates.newLat);
      this.props.changeGlobalState('lng', coordinates.newLng);
    });
  }

  componentDidUpdate(prevProps) {
    const { forecastWeather } = this.props;
    const defaultLocation = localStorage.getItem('lastLocation') || DEFAULTS.LOCATION;

    const prevLocation = prevProps.forecastWeather.length ? Object.values(prevProps.forecastWeather[0]).join(', ') : defaultLocation;
    const currentLocation = forecastWeather.length ? Object.values(forecastWeather[0]).join(', ') : defaultLocation;

    if (prevLocation !== currentLocation) {
      setCoordinatesByLocation(currentLocation, this.props).then(coordinates => {
        this.props.changeGlobalState('lat', coordinates.newLat);
        this.props.changeGlobalState('lng', coordinates.newLng);
        this.forceUpdate();
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { forecastWeather } = this.props;
    const defaultLocation = localStorage.getItem('lastLocation') || DEFAULTS.LOCATION;
    
    const currentCity = forecastWeather.length ? forecastWeather[0].city : defaultLocation;
    const nextCity = nextProps.forecastWeather.length ? nextProps.forecastWeather[0].city : defaultLocation;

    if (currentCity === nextCity) {
      return false;
    }

    return true;
  }

  onMapClick(e) {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    fetchForecastWeather(`${newLat},${newLng}`).then(forecastWeather => {
      const newLocation = Object.values(forecastWeather[0]).join(', ');
      localStorage.setItem('lastLocation', newLocation);
      
      setCoordinatesByLocation(newLocation, this.props).then(coordinates => {
        this.props.changeGlobalState('forecastWeather', forecastWeather);
        this.props.changeGlobalState('lat', coordinates.newLat);
        this.props.changeGlobalState('lng', coordinates.newLng);

        // Reset error.
        this.props.changeGlobalState('error', '');

        this.forceUpdate();
      });
    }).catch(err => this.props.changeGlobalState('error', err));
  }

  render() {
    const { lat, lng } = this.props;

    const RenderedMap = withScriptjs(withGoogleMap(props => 
      <GoogleMap defaultZoom={5} defaultCenter={{ lat, lng }} onClick={this.onMapClick}>
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    ));

    return (
      <div id='map'>
        <RenderedMap 
          googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyCYGAkeDkpAFR4l3bZ9x3BdTwXGlJrHQcI'
          loadingElement={<div style={{ width: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />} />
      </div>
    );
  }
}

export default Map;