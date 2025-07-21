const axios = require("axios");
exports.enrichMerchant = async (query) => {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    query
  )}&inputtype=textquery&fields=place_id,name,types,geometry&key=${
    process.env.GOOGLE_PLACES_API_KEY
  }`;
  const res = await axios.get(url);
  console.log("Google Places API response:", res.data);
  return res.data.candidates[0];
};
