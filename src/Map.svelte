<script>
  import { onDestroy, onMount } from "svelte";
  import { parcelData, menuHeight } from "./stores";
  import { mapbox } from "./mapbox";

  let mapContainer;
  let map;
  let markers = [];

  let selectedPoint = [];
  let otherPoints = [];
  let selectedLine = [];
  let otherLines = [];

  onMount(() => {
    map = new mapbox.Map({
      container: mapContainer,
      style: "mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9",
      center: [0, 0],
      zoom: 1,
    });

    map.on("load", function() {
      map.addSource("selectedPoint", {
        type: "geojson",
        data: selectedPoint
      });

      map.addSource("otherPoints", {
        type: "geojson",
        data: otherPoints
      });

      map.addSource("selectedLine", {
        type: "geojson",
        data: selectedLine
      });

      map.addSource("otherLines", {
        type: "geojson",
        data: otherLines
      });

      map.addLayer({
        id: "selectedPoint",
        type: "circle",
        source: "selectedPoint",
        paint: {
          "circle-radius": 36,
          "circle-color": "#2D3352"
        }
      });

      map.addLayer({
        id: "otherPoints",
        type: "circle",
        source: "otherPoints",
        paint: {
          "circle-radius": 25,
          "circle-color": "#3A4CA6"
        }
      });

      map.addLayer({
        id: "selectedLine",
        type: "line",
        source: "selectedLine",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#2D3352",
          "line-width": 6
        }
      });

      map.addLayer({
        id: "otherLines",
        type: "line",
        source: "otherLines",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#3A4CA6",
          "line-width": 4
        }
      });
    });

    return () => {
      map.remove();
    };
  });

  function recenterMap(args) {
    const height = args.height || $menuHeight || 0;
    const data = $parcelData;
    let { feature } = args;
    if (data) {
      if (!feature) {
        for (let key of Object.keys(data)) {
          if (data[key].active) {
            feature = data[key].find((item) => item.selected) || data[key].bbox;
          }
        }
      }

      if (map) {
        if (feature) {
          if (feature.bbox) {
            let paddingBottom = (height || 0) + 50;
            try {
              map.fitBounds(feature.bbox, {
                padding: {
                  top: 150,
                  left: 50,
                  right: 50,
                  bottom: paddingBottom,
                },
                maxZoom: 12
              });
            } catch (e) {
              map.fitBounds(feature.bbox);
            }
          }
        }
      }
    }
  }

  menuHeight.subscribe((height) => {
    recenterMap({ height });
  });

  // const unsubscribe = parcelData.subscribe((data) => {
  //   if (map) {
  //     if (data) {
  //       Object.keys(data).forEach((carrier) => {
  //         if (data[carrier].active) {
  //           const items = data[carrier];
  //           console.log(items);
  //           for (let index = 0; index < items.length; index++) {
  //             const item = items[index];
  //             if (item.feature) {
  //               if (item.feature.geometry && item.feature.geometry.type === "Point") {
  //                 const marker = new mapbox.Marker({
  //                   color: item.selected
  //                     ? "var(--dark-blue)"
  //                     : "var(--medium-blue)",
  //                 })
  //                   .setLngLat(item.feature.center)
  //                   .addTo(map);
  //                 markers.push(marker);
  //               } else if (item.feature.geometry && item.feature.geometry.type === "LineString") {
  //                 const lineId = `line${index}`;
  //                 map.addSource(lineId, {
  //                   type: "geojson",
  //                   data: item.feature
  //                 });
  //                 map.addLayer({
  //                   id: lineId,
  //                   type: "line",
  //                   source: lineId,
  //                   layout: {
  //                     "line-join": "round",
  //                     "line-cap": "round",
  //                   },
  //                   paint: {
  //                     "line-color": item.selected ? "#2D3352" : "#3A4CA6",
  //                     "line-width": 8
  //                   }
  //                 });
  //               } 

  //             }
  //           }
  //           const selectedItem = items.find((item) => item.selected);
  //           if (selectedItem) {
  //             recenterMap({ feature: selectedItem.feature });
  //           } else {
  //             recenterMap({ feature: items.bbox });
  //           }
  //         }
  //       });
  //     } else {
  //       markers.forEach((marker) => {
  //         try {
  //           marker.remove();
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       });
  //       markers = [];
  //     }
  //   }
  // });

  // onDestroy(unsubscribe);
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={mapContainer} />
