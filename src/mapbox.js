import mapbox from "mapbox-gl";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

let accessToken =
"pk.eyJ1IjoiZXZlcmV0dGJsYWtsZXkiLCJhIjoiY2tmNjVzcGh6MDJsbzJwbDdja3QwNzJ4dSJ9.nq8Ad46ZaLw8z0JBm0JBlQ";

mapbox.accessToken = accessToken;

export { mapbox, mapboxSdk, geocoding };