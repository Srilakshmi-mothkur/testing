// utils/geoCode.js
const axios = require('axios');

const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'diksha-app'  
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lng: lon };
    } else {
      console.warn('No coordinates found for address:', address);
      return null;
    }
  } catch (error) {
    console.error('Geocoding failed:', error.message);
    return null;
  }
};

module.exports = getCoordinatesFromAddress;
