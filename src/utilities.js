import { mapbox, mapboxSdk, geocoding } from "./mapbox";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { feature as toFeature, featureCollection, lineString } from "@turf/helpers";
import deepEqual from "deep-equal";

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
  let locationName;
  if (typeof location === "string") {
    locationName = location;
  } else {
    locationName = `${location.city}, ${location.state && location.state + ", "}${location.country}`;
  }

  return geocodingClient
    .forwardGeocode({
      query: locationName,
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

  if (features.length === 1 && features[0].bbox) {
    return features[0].bbox;
  }
  features = featureCollection(features);
  const boundingBox = bbox(features);
  const boundingBoxPolygon = bboxPolygon(boundingBox);
  return boundingBoxPolygon;
};

export const compareLocations = (loc1, loc2) => {
  if (typeof loc1 === "string") {
    if (typeof loc2 === "string") {
      return loc1 === loc2;
    }
    return false;
  } else {
    if (typeof loc2 === "string") {
      return false;
    }
    return deepEqual(loc1, loc2);
  }
};

export const getLineBetweenPoints = (points) => {
  const lines = [];
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    if (point.feature && index + 1 < points.length && points[index + 1].feature) {
      const nextPoint = points[index + 1];
      if (!compareLocations(nextPoint.location, point.location)) {
        const line = lineString([point.feature.center, nextPoint.feature.center]);
        lines.push({
          feature: line,
          selected: false
        });
      }
    }
  }
  return lines;
};

export const initializeData = async (data) => {
  const mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
  const geocodingClient = geocoding(mapboxClient);

  const keys = Object.keys(data);
  for (let key of keys) {
    for (let index = 0; index < data[key].length; index++) {
      const value = data[key][index];

      if (value.location) {
        if (value.location.city) {
          // Sentence case the city names
          data[key][index].location.city = toSentenceCase(data[key][index].location.city);

          // Get the Mapbox feature for each location
          data[key][index].feature = await getFeatureForLocation(geocodingClient, value.location);
        } else if (typeof value.location === "string") {
          // Sentence case the city names
          let name = value.location.split(",");
          name[0] = toSentenceCase(name[0]);
          data[key][index].location = name.length > 1 ? name.join(", ") : name[0];

          // Get the Mapbox feature for each location
          data[key][index].feature = await getFeatureForLocation(geocodingClient, value.location);
        }
      }

      // Give each input a selected value
      data[key][index].selected = false;
    }

    // Get all the lines connecting different points
    const lines = getLineBetweenPoints(data[key]);
    data[key].push(...lines);

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

