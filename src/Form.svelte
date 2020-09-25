<script>
  import {slide} from "svelte/transition";
  import { loading, parcelData } from "./stores";
  import { doAPICall } from "./api";
  import { transformData } from "./utilities/dataUtilities";

  let trackingNumber;
  let errorMessage = "";
  let data = null;
  $: error = errorMessage !== "";
  $: pushToTop = data != null;

  let input;

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
            errorMessage = "Couldn't find tracking details for this tracking number. Please ensure it is correct, and that it is from one of the supported carriers";
            return;
          }
          errorMessage = "Hmm.. Something went wrong.. Please try a different tracking number";
          return;
        }
        try {
          let responseData = await res.json();
          data = await transformData(responseData);
          console.log(data);
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
    padding: 16px;
    border-radius: 8px;
    max-width: 400px;
    box-sizing: content-box;
  }

  @media only screen and (max-width: 576px) {
    header h1 {
      font-size: 24px;
    }

    input#tracking-number {
      padding: 4px;
      max-width: 75%;
    }

    form button.btn {
      margin-left: auto;
    }
    
    form button.btn,
    input#tracking-number,
    form label {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 768px) {
    .form-container {
      max-width: 80%;
    }

    .form-container form {
      max-width: 100%;
    }

    .form-container .form-row input {
      font-size: 18px;
    }

    .form-container.top form input {
      width: inherit;
    }
  }

  .form-container form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-width: max-content;
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

  .form-row { 
    display: flex;
    width: 100%;
  }
  
  form button:hover {
    background: var(--dark-blue);
    color: var(--light);
  }
  
  form button {
    background: var(--light);
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    transition: 100ms ease-in-out;
    font-size: 18px;
    margin-left: 8px;
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
  form.error input,
  p.error {
    color: var(--red);
  }

  form.error input,
  form.error input:focus {
    border-color: var(--red);
  }

  form input:focus,
  form button:focus {
    outline-style: none;
  }

  p.error, p.help {
    margin: 8px 0;
  }

  p.help {
    font-size: 12px;
  }
</style>

<div class="form-container {pushToTop ? 'top' : ''}">
  <header transition:slide>
    <h1>Parcel Tracker</h1>
    <p class="help">Enter in a tracking number from Canada Post, DHL, FedEx, SkyNet Worldwide, USPS, or UPS, and see the order history plotted on the map!</p>
  </header>
  <form on:submit|preventDefault={getData} class={error ? "error" : ""}>
    <label for="tracking-number">Tracking Number</label>
    <div class="form-row">
      <input
      type="text"
      id="tracking-number"
      bind:this={input}
      bind:value={trackingNumber} />
      <button class="btn" on:submit|preventDefault={getData}>
        Submit
      </button>
    </div>
  </form>
  {#if error}
    <p class="error" transition:slide>
      {errorMessage}
    </p>
  {/if}
</div>