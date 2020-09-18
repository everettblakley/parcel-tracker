<script>
  import { slide } from "svelte/transition";
  let accessToken =
    "pk.eyJ1IjoiZXZlcmV0dGJsYWtsZXkiLCJhIjoiY2tmNjVzcGh6MDJsbzJwbDdja3QwNzJ4dSJ9.nq8Ad46ZaLw8z0JBm0JBlQ";

  let trackingNumber = "4010765063638021";
  let result;

  $: pushToTop = result !== undefined;

  let src = "/images/arrow.svg";
  let collapsed = true;

  function collapse() {
    collapsed = !collapsed;
  }

  let loading = false;
  function getData() {
    loading = true;
    fetch("/api/parcels/" + trackingNumber)
      .then(async (data) => {
        try {
          const text = await data.json();
          console.log(text);
        } catch (e) {
          console.error(e);
        }
      })
      .finally(() => (loading = false));
  }

  function handleChange(e) {
    console.log(e.target.value);
  }
</script>

<style>
  .parent {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
  }

  main {
    position: relative;
    background: lightcyan;
    border-bottom: 2px #1a1a1a solid;
  }

  .locations {
    padding: 2rem;
    background: lightcoral;
  }

  .tracking-number-input {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transition: all 200ms ease-in-out;
    transform: translate(-50%, -50%);
  }

  .tracking-number-input form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .tracking-number-input.top {
    top: 18px;
    transform: translate(-50%);
  }

  .tracking-number-input.top form input {
    padding: 8px;
    font-size: 18px;
  }
  .tracking-number-input.top form label {
    font-size: 18px;
  }

  input {
    font-size: 24px;
    padding: 12px;
    border-radius: 5px;
    border: 1px rgb(50, 50, 50) solid;
  }
  label {
    font-size: 24px;
    color: black;
    font-weight: 900;
    margin-bottom: 4px;
  }

  img {
    max-height: 100%;
  }

  .btn,
  .btn:focus {
    background: none;
    border: none;
  }

  .collapse-button {
    background: white;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 0.5rem;
    border: 2px #1a1a1a solid;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    z-index: 100;
  }

  .collapse-button img {
    transition: 200ms ease-in-out;
  }

  .collapse-button.collapsed img {
    transform: rotate(180deg);
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    z-index: 1000;
    transition: 200ms ease-in-out;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading .spinner {
    width: 5rem;
    height: 5rem;
  }

  .loading.active {
    visibility: visible;
    background: rgba(0, 0, 0, 0.5);
  }
</style>

<div class="loading {loading ? 'active' : ''}">
  <img class="spinner" src="/images/spinner.svg" alt="loading spinner" />
</div>

<div class="parent">
  <main>
    <div class="tracking-number-input {pushToTop ? 'top' : ''}">
      <form on:submit|preventDefault={getData}>
        <label for="tracking-number">Tracking Number</label>
        <input
          type="text"
          id="tracking-number"
          value={trackingNumber}
          on:input={handleChange} />
      </form>
    </div>

    <!-- <img
      class="map-img"
      src="https://www.nationalgeographic.com/content/dam/ngdotcom/rights-exempt/maps/world-classic-2018-banner-clip-72.adapt.1900.1.jpg"
      alt="map" /> -->
    <div
      class="collapse-button btn {collapsed ? 'collapsed' : ''}"
      on:click={collapse}>
      <img {src} alt="" />
    </div>
  </main>

  {#if !collapsed}
    <section class="locations" transition:slide>
      <p>Some stuff here later</p>
    </section>
  {/if}
</div>
