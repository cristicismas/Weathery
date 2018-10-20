import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import { apiCall } from '../services/api.js';

const google = window.google;

class Map extends Component {
  constructor(props) {
    super(props);

    const lastLocation = localStorage.getItem('lastLocation');
    const lastLat = parseFloat(localStorage.getItem('lastLat'));
    const lastLng = parseFloat(localStorage.getItem('lastLng'));

    // Defaults coordinates to last searched location or Paris.
    this.state = {
      lat: lastLat || 48.8534100,
      lng: lastLng || 2.3488000,
      defaultLocation: lastLocation || 'Paris'
    };

    this.setCoordinatesByLocation = this.setCoordinatesByLocation.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  // TODO: fix bug where after refresh coordinates are the same (make a componentDidMount where you are resetting coordinates based on current location. Also make getting coords a function).
  componentDidMount() {
    const currentCity = localStorage.getItem('lastLocation');
    this.setCoordinatesByLocation(currentCity);
  }

  componentDidUpdate(prevProps) {
    const { forecastWeather } = this.props;
    const { defaultLocation } = this.state;

    const prevCity = prevProps.forecastWeather.length ? prevProps.forecastWeather[0].city : defaultLocation;
    const currentCity = forecastWeather.length ? forecastWeather[0].city : defaultLocation;

    if (prevCity !== currentCity) {
      this.setCoordinatesByLocation(currentCity);
      console.log(parseFloat(localStorage.getItem('lastLat')));
      console.log(parseFloat(localStorage.getItem('lastLng')));
    }
  }

  setCoordinatesByLocation(location) {
    const geocoder = new google.maps.Geocoder();
      
    // Set latitude and longitude for given city name.
    geocoder.geocode({ 'address': location }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const newLat = results[0].geometry.location.lat();
        const newLng = results[0].geometry.location.lng();


        localStorage.setItem('lastLocation', location);
        localStorage.setItem('lastLat', newLat);
        localStorage.setItem('lastLng', newLng);

        this.setState({ lat: newLat, lng: newLng });

        // Remove error on a successful search.
        this.props.changeGlobalState('error', null);
      } else {
        // Sometimes google maps' api gives ZERO_RESULTS even when it finds results, so ignore this error.
        if (status === 'ZERO_RESULTS') {
          this.props.changeGlobalState('error', null);
        } else {
          this.props.changeGlobalState('error', status);
        }
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const { forecastWeather } = this.props;
    const { defaultLocation } = this.state;
    
    const currentCity = forecastWeather.length ? forecastWeather[0].city : defaultLocation;
    const nextCity = nextProps.forecastWeather.length ? nextProps.forecastWeather[0].city : '';

    if (currentCity === nextCity) {
      return false;
    }

    return true;
  }

  onMapClick(e) {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    this.setState({ lat: newLat, lng: newLng });

    apiCall('get', `forecast_weather/${newLat},${newLng}`)
      .then(res => {
        this.props.changeGlobalState('forecastWeather', res);
      })
      .catch(err => {
        this.props.changeGlobalState('error', err.message);
      });
  }

  render() {
    const { lat, lng } = this.state;

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