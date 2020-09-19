import { mapbox, mapboxSdk, geocoding } from "./mapbox";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { feature as toFeature, featureCollection } from "@turf/helpers";

export const toSentenceCase = (text) => {
  return text.replace(/\w\S*/g, function (text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
};

export const replaceUnderScores = (text) => {
  return text.replace(/_/g, " ");
};

export const carrierName = (name) => {
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
};

export const getFeatureForLocation = (geocodingClient, location) => {
  return geocodingClient
    .forwardGeocode({
      query: `${location.city}, ${location.state && location.state + ", "}${location.country}`,
      autocomplete: false,
      limit: 1,
    })
    .send()
    .then((response) => {
      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        const feature = response.body.features[0];
        return feature;
      }
    })
    .catch((error) => {
      console.log(error);
      return;
    });
};

export const getBoundingBoxForLocations = (data) => {
  let features = data
    .map(({ feature }) => {
      if (feature) {
        return toFeature(feature.geometry);
      }
    })
    .filter((i) => i !== undefined);
  features = featureCollection(features);
  const boundingBox = bbox(features);
  const boundingBoxPolygon = bboxPolygon(boundingBox);
  return boundingBoxPolygon;
};

export const initializeData = async (data) => {
  const mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
  const geocodingClient = geocoding(mapboxClient);

  const keys = Object.keys(data);
  for (let key of keys) {
    for (let index = 0; index < data[key].length; index++) {
      const value = data[key][index];

      if (value.location && value.location.city) {
        // Sentence case the city names
        data[key][index].location.city = toSentenceCase(data[key][index].location.city);

        // Get the Mapbox feature for each location
        data[key][index].feature = await getFeatureForLocation(geocodingClient, value.location);
      }

      // Give each input a selected value
      data[key][index].selected = false;
    }

    // Set the bounding box for the features
    data[key].bbox = getBoundingBoxForLocations(data[key]);

    // Sort the data based on the timestamp
    data[key] = data[key].sort((a, b) => {
      return a.timestamp < b.timestamp
        ? -1
        : a.timestamp > b.timestamp
          ? 1
          : 0;
    });

    // If set the first carrier to be active
    data[key].active = keys.indexOf(key) === 0;


    // Replace the keys with properly named keys
    const newKey = carrierName(key);
    data[newKey] = data[key];
    delete data[key];
  }

  return data;
};

