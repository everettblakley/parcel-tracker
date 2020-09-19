<script>
  import { onDestroy, onMount } from "svelte";
  import { parcelData, loading, menuHeight } from "./stores";
  import { mapbox } from "./mapbox";

  let mapContainer;
  let map;

  onMount(() => {
    map = new mapbox.Map({
      container: mapContainer,
      style: "mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9",
      center: [0, 0],
      zoom: 1,
    });

    return () => {
      map.remove();
    };
  });

  menuHeight.subscribe((height) => {
    const data = $parcelData;
    let feature;
    if (data) {
      for (let key of Object.keys(data)) {
        if (data[key].active) {
          feature = data[key].find((item) => item.selected) || data[key].bbox;
        }
      }

      if (map) {
        if (feature) {
          if (feature.bbox) {
            let paddingBottom = (height || 0) + 50;
            console.log(feature);
            map.fitBounds(feature.bbox, {
              padding: { top: 150, left: 50, right: 50, bottom: paddingBottom },
            });
          }
        }
      }
    }
  });

  const unsubscribe = parcelData.subscribe((data) => {
    loading.update(() => true);
    if (data && map) {
      Object.keys(data).forEach((carrier) => {
        if (data[carrier].active) {
          const items = data[carrier];
          for (let item of items) {
            if (item.feature) {
              new mapbox.Marker({
                color: item.selected
                  ? "var(--dark-blue)"
                  : "var(--medium-blue)",
              })
                .setLngLat(item.feature.center)
                .addTo(map);
            }
          }
        }
      });
    }
    loading.update(() => false);
  });

  onDestroy(unsubscribe);
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={mapContainer} />
