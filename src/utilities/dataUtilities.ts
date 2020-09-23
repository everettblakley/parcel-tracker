import { mapbox, mapboxSdk, geocoding } from "../mapbox";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { feature as toFeature, featureCollection, lineString } from "@turf/helpers";
import type { ParcelData, Point } from "../types";
import { Location } from "../types";
import {replaceUnderScores, toSentenceCase} from "./textUtilities";

declare type LocationOrString = Location | string;

export const carrierName = (name: string) => {
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
};

export const getFeatureForLocation = (geocodingClient: any, location: LocationOrString) => {
  let locationName = location.toString();

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

export const compareLocations = (loc1: LocationOrString, loc2: LocationOrString) => {
  return loc1.toString() === loc2.toString();
};

export const getLineBetweenPoints = (points: Point[]) => {
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

export const getLocation = (value) : LocationOrString => {
  if (value.location) {
    if (typeof value.location === "string") {
      return value.location;
    }
    const { city, state, country, postalCode } = value.location;
    return new Location(city, state, country, postalCode);
  }
  return undefined;
} 

export const initializeData = async (data): Promise<ParcelData> => {
  const mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
  const geocodingClient = geocoding(mapboxClient);

  let parcelData: ParcelData = {};

  const keys = Object.keys(data);
  for (let key of keys) {
    console.log(data[key]);
    parcelData[key] = [];
    for (let index = 0; index < data[key].length; index++) {
      const value = data[key][index];

      let feature: any;
      let location: Location;

      if (value.location) {
        location = getLocation(value);

        if (location.city) {
          // Get the Mapbox feature for each location
          feature = await getFeatureForLocation(geocodingClient, location);
        }
      }

      const point: Point = {
        location: location?.toString(),
        selected: false,
        index,
        feature,
        events: []
      }

      point.events.push({
        timestamp: value.timestamp,
        status: value.status
      });

      let count = 1;
      let nextPoint = data[key][index + 1];
      while(nextPoint) {
        const nextLocation = getLocation(nextPoint);
        if (compareLocations(location, nextLocation)) {
          data[key].splice(index+1, 1);
          point.events.push({
            timestamp: nextPoint.timestamp,
            status: nextPoint.status
          });
        } else {
          break;
        }
        count += 1;
        nextPoint = data[key][index + count];
      }

      parcelData[key].push(point);
    }

    // Get all the lines connecting different points
    // const lines = getLineBetweenPoints(data[key]);
    // data[key].push(...lines);

    // Set the bounding box for the features
    // data[key].bbox = getBoundingBoxForLocations(data[key]);

    // Sort the data based on the timestamp
    // data[key] = data[key].sort((a, b) => {
    //   return a.timestamp < b.timestamp
    //     ? -1
    //     : a.timestamp > b.timestamp
    //       ? 1
    //       : 0;
    // });

    // If set the first carrier to be active
    // data[key].active = keys.indexOf(key) === 0;


    // Replace the keys with properly named keys
    // const newKey = carrierName(key);
    // data[newKey] = data[key];
    // delete data[key];
  }

  console.log(parcelData);
  return parcelData;
};

