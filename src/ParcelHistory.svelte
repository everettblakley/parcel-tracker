<script lang="ts">
  import { onDestroy } from "svelte";
  import ParcelListConnector from "./ParcelListConnector.svelte";
  import ParcelListItem from "./ParcelListItem.svelte";
  import { parcelData } from "./stores";
  import type { ParcelData } from "./types";

  let data: ParcelData;

  const unsubscribe = parcelData.subscribe((value) => {
    data = value as ParcelData;
  });

  onDestroy(unsubscribe);
</script>

<style>
  .container {
    padding: 16px;

    scrollbar-color: var(--dark-blue) var(--light);
    scrollbar-width: thin;
  }

  ol.items {
    display: flex;
    flex-direction: column;
    position: relative;
    counter-reset: item;
  }

  /* div::-webkit-scrollbar {
    width: 1em;
  }
  
  div::-webkit-scrollbar-track {
    padding: 0 2rem;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  div::-webkit-scrollbar-thumb {
    background-color: pink;
    outline: 1px solid red;
  } */
</style>

<div class="container">
  {#if data}
    {#each Object.keys(data) as carrier}
      <h3>Delivered by: {carrier}</h3>
      <ol class="items">
        {#each data[carrier].featureCollection.features as feature (feature.id)}
          {#if feature.geometry?.type === 'Point'}
            <ParcelListItem {carrier} {feature} />
          {:else}
            <ParcelListConnector {carrier} {feature} />
          {/if}
        {/each}
      </ol>
    {/each}
  {:else}
    <p>
      Enter your tracking number into the form! Once we get the data, the
      details will show up here
    </p>
  {/if}
</div>
