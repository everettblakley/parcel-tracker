<script>
  import { Map } from "@beyonk/svelte-mapbox";
  export let accessToken =
    "pk.eyJ1IjoiZXZlcmV0dGJsYWtsZXkiLCJhIjoiY2tmNjVzcGh6MDJsbzJwbDdja3QwNzJ4dSJ9.nq8Ad46ZaLw8z0JBm0JBlQ";

  let mapComponent;
  let trackingNumber = "";
  let result;
</script>

<style>
  :global(.mapboxgl-map) {
    height: 100%;
  }

  .tracking-number-input {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-self: center;
    text-align:center;
    transform: translate(-50%, -50%);
  }

  input {
    border-radius: 5px;
    padding: 16px;
    font-size: 18px;
  }

  label {
    font-size: 18px;
  }
</style>

{#if !result}
  <main class="tracking-number-input">
    <label for="tracking-number">Tracking Number</label>
    <input type="text" id="tracking-number" value={trackingNumber}/>
  </main>
{/if}

<Map
  {accessToken}
  bind:this={mapComponent}
  on:recenter={(e) => console.log(e.detail.center.lat, e.detail.center.lng)} />
