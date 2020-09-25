import { geocoding, mapbox, mapboxSdk } from "../mapbox";
import type { LocationOrString, ParcelData, Point, Properties } from "../types";
import { Location } from "../types";
import { replaceUnderScores, toSentenceCase } from "./textUtilities";
import { getFeatureForLocation } from "./geographicUtilities";
import moment from "moment";
import type { Feature, Point as GeoJSONPoint } from "@turf/helpers";

export const carrierName = (name: string) => {
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
};

export const getLocation = (value): LocationOrString => {
  if (value && value.location) {
    if (typeof value.location === "string") {
      return value.location;
    }
    const { city, state, country, postalCode } = value.location;
    return new Location(city, state, country, postalCode);
  }
  return undefined;
}

export const init = () => {
  const mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
  const geocodingClient = geocoding(mapboxClient);
  return { geocodingClient };
}

export const lib = {
  init
};

export const combineLocations = async (input: any): Promise<Point[]> => {
  const { geocodingClient } = init();
  const output: Point[] = [];

  let data = [...input];
  data.sort((a, b) => {
    return a.timestamp < b.timestamp
      ? -1
      : a.timestamp > b.timestamp
        ? 1
        : 0;
  });

  while (data.length > 0) {
    const value = data[0];

    let feature: Point;
    let location: Location;

    if (value.location) {
      location = getLocation(value);

      if (location.city) {
        // Get the Mapbox feature for each location
        const response = await getFeatureForLocation(geocodingClient, location);
        feature = (response as unknown) as Point;
      }
    }

    const point: Point = {
      ...feature,
      type: feature?.type,
      id: output.length,
      properties: {
        ...feature?.properties,
        location: location?.toString(),
        events: [],
        selected: false
      },
    }

    const locations: Set<LocationOrString> = new Set([location?.toString()]);

    let count = 1;
    let nextPoint = data[count];
    do {
      const nextLocation = getLocation(nextPoint);
      locations.add(nextLocation?.toString());
      count += 1;
      nextPoint = data[count];
    } while (locations.size === 1)

    const removedPoints = data.splice(0, count - 1);
    removedPoints.forEach((event) => {
      point.properties?.events.push({
        timestamp: moment(event.timestamp),
        status: event.status
      });
    });

    output.push(point);
  }
  return output;
}

export const transformData = async (data): Promise<ParcelData> => {
  let parcelData: ParcelData = {};

  const keys = Object.keys(data);
  for (let key of keys) {
    // console.log(data[key]);
    const features = await combineLocations(data[key]);
    const newKey = carrierName(key);
    parcelData[newKey] = {
      type: "FeatureCollection",
      features
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
  }

  // console.log(parcelData);
  return parcelData;
};
