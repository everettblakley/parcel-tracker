import mapbox from "mapbox-gl";

let accessToken =
"pk.eyJ1IjoiZXZlcmV0dGJsYWtsZXkiLCJhIjoiY2tmNjVzcGh6MDJsbzJwbDdja3QwNzJ4dSJ9.nq8Ad46ZaLw8z0JBm0JBlQ";

mapbox.accessToken = accessToken;

const key = {};

export { mapbox, key };