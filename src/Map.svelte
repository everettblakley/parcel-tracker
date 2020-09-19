<script>
  import { onMount } from "svelte";

  import { mapbox } from "./mapbox";

  let mapContainer;
  let map;

  onMount(() => {
    map = new mapbox.Map({
      container: mapContainer,
      style: "mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9",
      zoom: 0
    });

    return () => {
      map.remove();
    }
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={mapContainer}>
  {#if map}
    <slot></slot>
  {/if}
</div>
