<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { parcelData, menuHeight } from "./stores";
  import { mapbox } from "./mapbox";
  import type { LineString, ParcelData, Point } from "./types";
  import type { GeoJSONSource } from "mapbox-gl";

  let mapContainer;
  let map : mapbox.Map;

  interface MapData {
    id: string;
    features: any[];
  }

  let points : MapData = {
    id: "points",
    features: []
  }
  let selectedLine : MapData = {
    id: "selectedLine",
    features: []
  };
  let otherLines : MapData = {
    id: "otherLines",
    features: []
  };

  let selectedPointId = null;

  function init() {
    points.features = [];
    selectedLine.features = [];
    otherLines.features = [];
  }

  onMount(() => {
    init();

    map = new mapbox.Map({
      container: mapContainer,
      style: "mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9",
      center: [0, 0],
      zoom: 1,
    });

    map.on("load", function() {
      map.addSource(points.id, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points.features
        }
      });

      map.addSource(selectedLine.id, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: selectedLine.features
        }
      });

      map.addSource(otherLines.id, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: otherLines.features
        }
      });

      map.addLayer({
        id: points.id,
        type: "circle",
        source: points.id,
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            18,
            14
          ],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#2D3352",
            "#3A4CA6"
          ]
        }
      });

      map.addLayer({
        id: selectedLine.id,
        type: "line",
        source: selectedLine.id,
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
        id: otherLines.id,
        type: "line",
        source: otherLines.id,
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#3A4CA6",
          "line-width": 4
        }
      });

      map.on("click", points.id, function(e) {
        if (e.features.length > 0) {
          console.log(e.features[0]);
          if (selectedPointId) {
            map.setFeatureState(
              { source: points.id, id: selectedPointId },
              { selected: false }
            );
          }
          selectedPointId = e.features[0].id;
          map.setFeatureState(
            { source: points.id, id: selectedPointId },
            { selected: true }
          );
          
        }
      });

      map.on('mouseenter', 'points', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
        
        // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'points', function () {
        map.getCanvas().style.cursor = '';
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

  const unsubscribe = parcelData.subscribe((data: ParcelData) => {
    if (map) {
      if (data) {
        try {
          init();
          Object.keys(data).forEach((carrier) => {
            if (data[carrier]) {
              const features = data[carrier].features;
              features.forEach((feature: Point | LineString) => {
                if (feature.geometry && feature.geometry.type === "Point") {
                  let mapboxFeature : any = {...feature};
                  mapboxFeature.state = {
                    selected: feature.properties.selected
                  }
                  points.features.push(mapboxFeature);
                }
              });
            }
          });
          console.log(points.features);
          (map.getSource(points.id) as GeoJSONSource).setData({
            type: "FeatureCollection",
            features: points.features
          });
        } catch(e) {
          console.log(e);
        }
      } else {
        // markers.forEach((marker) => {
        //   try {
        //     marker.remove();
        //   } catch (e) {
        //     console.log(e);
        //   }
        // });
        // markers = [];
      }
    }
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
