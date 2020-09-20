<script>
  import { slide } from "svelte/transition";
  import { initializeData } from "./utilities";
  import { parcelData, menuHeight } from "./stores";
  import Map from "./Map.svelte";
  import ParcelHistory from "./ParcelHistory.svelte";
  import { onDestroy } from "svelte";


  let trackingNumber; // = "4010765063638021";
  let data;
  let errorMessage = "";
  $:error = errorMessage !== "";
  let main;
  let loading = false;

  $: pushToTop = data !== undefined;

  let src = "/images/arrow.svg";
  let collapsed = false;

  function collapse() {
    collapsed = !collapsed;
  }

  const unsubscribe = parcelData.subscribe((value) => {
    if (!value) {
      trackingNumber = "";
      collapsed = true;
      errorMessage = "";
    }
    data = value;
  });

  function doAPICall() {
    return fetch("https://package.place/api/track/" + trackingNumber);
  }

  function getData() {
    if (!trackingNumber) {
      errorMessage = "Please enter a tracking number!";
      return;
    }
    errorMessage = "";
    loading = true;
    doAPICall()
      .then(async (res) => {
        if (res.status !== 200) {
          if (res.status === 404) {
            errorMessage = "Couldn't find tracking details for this tracking number. Please ensure it is from one of the supported carriers, listed below";
            return;
          }
          errorMessage = "Hmm.. Something went wrong.. Please try a different tracking number";
          return;
        }
        try {
          let responseData = await res.json();
          await initializeData(responseData);
          data = responseData;
          parcelData.set(data);
          collapsed = false;
        } catch (e) {
          errorMessage = "Hmm.. Something went wrong processing the tracking data.. Please try again";
          console.error(e);
        } finally {
          loading = false;
        }
      })
      .catch(() => (errorMessage = "Hmm.. Something went wrong.. Please try again later"))
      .finally(() => {
        loading = false;
      });
  }

  function collapseChanged(e) {
    menuHeight.update(() => e.target.clientHeight);
  }

  onDestroy(unsubscribe);
</script>

<style>
  .container {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
  }

  main {
    position: relative;
    border-bottom: 2px #1a1a1a solid;
  }

  .tracking-number-input {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transition: all 200ms ease-in-out;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--light);
    padding: 1rem;
    border-radius: 8px;
    max-width: 400px;
  }

  .tracking-number-input form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: max-content;
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
    border: 1px var(--dark) solid;
    width: auto;
  }
  label {
    font-size: 24px;
    color: var(--dark);
    font-weight: 900;
    margin-bottom: 4px;
  }

  .error {
    color: var(--red);
  }

  p.error, p.help {
    margin: 8px 0;
  }

  p.help {
    font-size: 12px;
  }

  input.error {
    border-color: var(--red);
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

  .locations {
    overflow: hidden;
  }
</style>

<div class="loading {loading ? 'active' : ''}">
  <img class="spinner" src="/images/spinner.svg" alt="loading spinner" />
</div>

<div class="container">
  <main bind:this={main}>
    <div class="tracking-number-input {pushToTop ? 'top' : ''}">
      <form on:submit|preventDefault={getData}>
        <label for="tracking-number">Tracking Number</label>
        <input
          type="text"
          class={error ? "error" : ""}
          id="tracking-number"
          bind:value={trackingNumber} />
      </form>
      {#if error}
        <p class="error" transition:slide>
          {errorMessage}
        </p>
      {/if}
      {#if !pushToTop}
        <p class="help" transition:slide>Enter in a tracking number from Canada Post, DHL, FedEx, SkyNet Worldwide, USPS, or UPS, and see the order history plotted on the map!</p>
      {/if}
    </div>

    <Map />
    <div
      class="collapse-button btn {collapsed ? 'collapsed' : ''}"
      on:click={collapse}>
      <img {src} alt="" />
    </div>
  </main>

  {#if !collapsed}
    <section 
      class="locations" 
      transition:slide 
      on:introend={collapseChanged} 
      on:outroend={collapseChanged}>
      <ParcelHistory />
    </section>
  {/if}
</div>
