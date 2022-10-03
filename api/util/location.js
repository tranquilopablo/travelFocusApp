const API_KEY = process.env.GOOGLE_API_KEY;
const axios = require('axios');


async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new Error('Nie można znależć miejsca dla podanego adresu. Proszę podaj poprawne dane lokalizacji.');
    error.code = 422;
    throw error;

  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
