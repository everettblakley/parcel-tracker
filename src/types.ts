import type moment from "moment";
import { toSentenceCase } from "./utilities/textUtilities";
import type { Feature as GeoJSONFeature, FeatureCollection, Properties as GeoJSONProperties, Point as GeoJSONPoint, LineString as GeoJSONLineString } from "@turf/helpers";

export class Location {
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  constructor(city?: string, state?: string, country?: string, postalCode?: string) {
    this.city = toSentenceCase(city);
    this.state = state;
    this.postalCode = postalCode;
    this.country = toSentenceCase(country);
  }

  toString(): string {
    return [this.city, this.state, this.country, this.postalCode].filter(Boolean).join(", ");
  }
}

export type LocationOrString = Location | string;

export interface ITrackingEvent {
  timestamp: moment.Moment;
  status: string;
  location?: string | Location;
}

export interface Properties extends GeoJSONProperties {
  location?: string;
  events?: ITrackingEvent[];
}

export type Point = GeoJSONFeature<GeoJSONPoint, Properties>;

export type LineString = GeoJSONFeature<LineString, Properties>;

export interface ParcelData {
  [key: string]: FeatureCollection<any, Properties>;
}