const google = window.google;

export function setCoordinatesByLocation(location, contextLocation) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
      
    // Set latitude and longitude for given location name.
    geocoder.geocode({ 'address': location }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const newLat = results[0].geometry.location.lat();
        const newLng = results[0].geometry.location.lng();
  
        // Remove error on a successful search.
        contextLocation.changeGlobalState('error', null);

        return resolve({ newLat, newLng });
      } else {
        // Sometimes google maps' api gives ZERO_RESULTS even when it finds results, so ignore this error.
        if (status === 'ZERO_RESULTS') {
          contextLocation.changeGlobalState('error', null);
        } else {
          contextLocation.changeGlobalState('error', status);
        }
      }
    });
  });
}