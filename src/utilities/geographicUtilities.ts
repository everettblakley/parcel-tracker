import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { feature as toFeature, featureCollection } from "@turf/helpers";
import type { LocationOrString, Point } from "../types";

export const getFeatureForLocation = (geocodingClient: any, location: LocationOrString) => {
  if (!geocodingClient || !location) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }
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


export const getLineBetweenPoints = (points: Point[]) => {
  const lines = [];
  // for (let index = 0; index < points.length; index++) {
  //   const point = points[index];
  //   if (point.feature && index + 1 < points.length && points[index + 1].feature) {
  //     const nextPoint = points[index + 1];
  //     // if (!compareLocations(nextPoint.location, point.location)) {
  //       const line = lineString([point.feature.center, nextPoint.feature.center]);
  //       lines.push({
  //         feature: line,
  //         selected: false
  //       });
  //     // }
  //   }
  // }
  return lines;
};