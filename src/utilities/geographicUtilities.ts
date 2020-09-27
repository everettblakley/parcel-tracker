import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { Feature as GeoJSONFeature, featureCollection, lineString } from "@turf/helpers";
import type { LocationOrString, Properties, Point, LineString, Feature } from "../types";

export const getFeatureForLocation = async (geocodingClient: any, location: LocationOrString): Promise<GeoJSONFeature<Point, Properties> | undefined> => {
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
        const feature = response.body.features[0] as GeoJSONFeature<Point, Properties>;
        return feature;
      }
    })
    .catch((error) => {
      console.log(error);
      return;
    });
};

export const getBoundingBoxForLocations = (inputFeatures: Feature[]): GeoJSONFeature => {
  let features = inputFeatures
    .filter((feature: Feature) => feature.geometry !== undefined);

  if (features.length === 1 && features[0].bbox) {
    return bboxPolygon(features[0].bbox);
  }
  const boundingBox = bbox(featureCollection(features));
  return bboxPolygon(boundingBox);
};


export const getLineBetweenPoints = (points: Point[]): LineString[] => {
  const lines: LineString[] = [];
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    if (point.geometry?.coordinates && index + 1 < points.length && points[index + 1].geometry?.coordinates) {
      const nextPoint = points[index + 1];
      const line = lineString([point.geometry.coordinates, nextPoint.geometry.coordinates]);
      line.properties.selected = false;
      lines.push((line as unknown) as LineString);
    }
  }
  return lines;
};