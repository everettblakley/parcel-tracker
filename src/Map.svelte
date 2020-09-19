<script>
  import { onMount } from "svelte";
  import { mapbox, mapboxSdk, geocoding } from "./mapbox";
  import { parcelData, loading } from "./stores";

  let mapContainer;
  let map;
  let mapboxClient;
  let geocodingClient;

  onMount(() => {
    map = new mapbox.Map({
      container: mapContainer,
      style: "mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9",
      center: [0, 0],
      zoom: 1,
    });

    mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
    geocodingClient = geocoding(mapboxClient);

    return () => {
      map.remove();
    };
  });

  function getFeatureForLocation(location) {
    if (location && location.city) {
      return geocodingClient
        .forwardGeocode({
          query: `${location.city}, ${location.state && location.state + ", "}${
            location.country
          }`,
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
            // console.log(feature);
            return feature;
          }
        })
        .catch((error) => {
          console.log(error);
          return;
        });
    }
    return;
  }

  function getBoundingBoxForLocations(data) {
    // xMin = bounds[0][0]
    // xMax = bounds [1][0]
    // yMin = bounds[0][1]
    // yMax = bounds[1][1]
    const bounds = [
      [undefined, undefined],
      [undefined, undefined],
    ];
    data.map(({ feature }) => {
      if (feature) {
        const { center } = feature;
        bounds[0][0] = bounds[0][0] < center[0] ? bounds[0][0] : center[0];
        bounds[1][0] = bounds[1][0] > center[0] ? bounds[1][0] : center[0];
        bounds[0][1] = bounds[0][1] < center[1] ? bounds[0][1] : center[1];
        bounds[1][1] = bounds[1][1] > center[1] ? bounds[1][1] : center[1];
      }
    });
    console.log("done getting the bounds");
    console.log(bounds);
    return bounds;
  }

  const unsubscribe = parcelData.subscribe((data) => {
    let updatesMade = false;
    loading.update(() => true);
    if (data && map) {
      Object.keys(data).forEach(async (carrier) => {
        const items = data[carrier];
        for (let item of items) {
          if (!item.feature) {
            const feature = await getFeatureForLocation(item.location);
            item.drawable = feature !== undefined;
            item.feature = feature;
            updatesMade = true;
          }
          if (item.drawable) {
            new mapbox.Marker().setLngLat(item.feature.center).addTo(map);
          }
        }
        console.log("done getting the features");
        const bounds = getBoundingBoxForLocations(items);
        map.fitBounds(bounds);
      });
    }
    loading.update(() => false);
    if (updatesMade) {
      parcelData.update(() => data);
    }
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={mapContainer} />
