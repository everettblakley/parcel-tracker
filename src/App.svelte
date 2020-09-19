<script>
  import { slide } from "svelte/transition";
  import { initializeData } from "./utilities";
  import {parcelData} from "./stores";
  import Map from "./Map.svelte";
  import ParcelHistory from "./ParcelHistory.svelte";

  let trackingNumber = "4010765063638021";
  let result;
  let error = false;

  $: pushToTop = result !== undefined;

  let src = "/images/arrow.svg";
  let collapsed = true;

  function collapse() {
    collapsed = !collapsed;
  }

  const unsubscribe = parcelData.subscribe(value => {
    if (value) {
    } else {
      trackingNumber = "";
      collapsed = true;
    }
    result = value;
  })

  function doAPICall() {
    return new Promise((resolve, _) =>
      resolve({
        status: 200,
        json: () => ({
          CANADA_POST: [
            {
              timestamp: "2020-09-14T19:25:43-06:00",
              status: "Electronic information submitted by shipper",
              location: {
                city: "",
                state: "",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-14T19:41:54-06:00",
              status: "Item processed",
              location: {
                city: "CALGARY",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-14T22:01:08-06:00",
              status: "Item in transit",
              location: {
                city: "CALGARY",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-15T07:24:58-06:00",
              status: "Item processed",
              location: {
                city: "LETHBRIDGE",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-15T10:40:49-06:00",
              status: "Item out for delivery",
              location: {
                city: "LETHBRIDGE",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-15T13:59:36-06:00",
              status:
                "Notice card left indicating where and when to pick up item",
              location: {
                city: "LETHBRIDGE",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-15T19:23:39-06:00",
              status: "Item available for pickup at Post Office",
              location: {
                city: "LETHBRIDGE",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
            {
              timestamp: "2020-09-17T11:36:57-06:00",
              status: "Delivered",
              location: {
                city: "LETHBRIDGE",
                state: "AB",
                country: "Canada",
                postalCode: "",
              },
            },
          ],
        }),
      })
    );
    // fetch("https://package.place/api/track/" + trackingNumber)
  }

  let loading = false;
  function getData() {
    error = false;
    loading = true;
    doAPICall()
      .then(async (res) => {
        if (res.status !== 200) {
          error = true;
          return;
        }

        try {
          const dirtyData = await res.json();
          const data = initializeData(dirtyData);
          result = data;
          parcelData.update(() => data);
          collapsed = false;
        } catch (e) {
          error = true;
          console.error(e);
        }
      })
      .catch(() => (error = true))
      .finally(() => (loading = false));
  }
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
    border: 1px rgb(50, 50, 50) solid;
    width: auto;
  }
  label {
    font-size: 24px;
    color: black;
    font-weight: 900;
    margin-bottom: 4px;
  }

  .error {
    color: var(--red);
  }

  p.error {
    margin: 4px 0;
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
  <main>
    <div class="tracking-number-input {pushToTop ? 'top' : ''}">
      <form on:submit|preventDefault={getData}>
        <label for="tracking-number">Tracking Number</label>
        <input
          type="text"
          class={error ? 'error' : ''}
          id="tracking-number"
          bind:value={trackingNumber} />
      </form>
      {#if error}
        <p class="error" transition:slide>
          Hmm.. Something went wrong.. Is that the right tracking number?
        </p>
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
    <section class="locations" transition:slide>
      <ParcelHistory />
    </section>
  {/if}
</div>
