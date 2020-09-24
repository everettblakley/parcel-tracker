import type moment from "moment";
import { toSentenceCase } from "./utilities/textUtilities";

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

export declare type LocationOrString = Location | string;

export interface ITrackingEvent {
  timestamp: moment.Moment;
  status: string;
  location?: string | Location;
}

export interface IEntity {
  selected: Boolean;
  feature?: any;
  index: Number;
}

export interface Point extends IEntity {
  location: string;
  events: ITrackingEvent[];
}

export interface Connector extends IEntity {
  source: string;
  destination: string;
}

export interface ParcelData {
  [key: string]: IEntity[];
}