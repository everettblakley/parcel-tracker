<script>
  import {slide} from "svelte/transition";
  import { loading, parcelData } from "./stores";
  import { doAPICall } from "./api";
  import { initializeData } from "./utilities";

  let trackingNumber;
  let errorMessage = "";
  let data = null;
  $: error = errorMessage !== "";
  $: pushToTop = data != null;

  function getData() {
    if (!trackingNumber) {
      errorMessage = "Please enter a tracking number!";
      return;
    }
    errorMessage = "";
    loading.set(true);
    doAPICall({trackingNumber, isDev: true})
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
        } catch (e) {
          errorMessage = "Hmm.. Something went wrong processing the tracking data.. Please try again";
          console.error(e);
        } finally {
          loading.set(false);
        }
      })
      .catch(() => (errorMessage = "Hmm.. Something went wrong.. Please try again later"))
      .finally(() => {
        loading.set(false);
      });
  }

  function handleSubmit() {
    if ($parcelData == null) {
      getData();
    } else {
      parcelData.set(null);
      trackingNumber = "";
      data = null;
    }
  }

</script>

<style>
  .form-container {
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

  .form-container form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: max-content;
  }

  .form-container.top {
    top: 18px;
    transform: translate(-50%);
  }

  .form-container.top form input {
    padding: 8px;
    font-size: 18px;
  }

  .form-container.top button.btn {
    padding: 8px;
  }

  .form-container.top header {
    display: none;
  }

  form span { 
    display: grid;
    grid-template-columns: 4fr 1fr;
    grid-gap: 8px;
    width: 100%;
  }
  
  form button:hover {
    background: var(--dark-blue);
    border: 1px var(--dark) solid;
    color: var(--light);
  }
  
  form button {
    background: var(--light);
    border: 1px var(--light) solid;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    transition: 100ms ease-in-out;
    font-size: 18px;
  }

  input {
    font-size: 24px;
    padding: 12px;
    border-radius: 5px;
    border: 1px var(--dark) solid;
  }

  label {
    font-size: 18px;
    color: var(--dark);
    margin-bottom: 4px;
  }

  form.error label, 
  form.error input {
    color: var(--red);
  }

  form.error input {
    border-color: var(--red);
  }

  p.error, p.help {
    margin: 8px 0;
  }

  p.help {
    font-size: 12px;
  }
</style>

<div class="form-container {pushToTop ? 'top' : ''}">
  <header>
    <h1>Parcel Tracker</h1>
    <p class="help" transition:slide>Enter in a tracking number from Canada Post, DHL, FedEx, SkyNet Worldwide, USPS, or UPS, and see the order history plotted on the map!</p>
  </header>
  <form on:submit|preventDefault={handleSubmit} class={error ? "error" : ""}>
    <label for="tracking-number">Tracking Number</label>
    <span>
      <input
      type="text"
      id="tracking-number"
      bind:value={trackingNumber} />
      <button class="btn" on:submit|preventDefault={handleSubmit}>
        {data == null ? "Submit" : "Clear"}
      </button>
    </span>
  </form>
  {#if error}
    <p class="error" transition:slide>
      {errorMessage}
    </p>
  {/if}
</div>