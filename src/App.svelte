<script lang="ts">
  import { slide } from "svelte/transition";
  import { parcelData, menuHeight, loading } from "./stores";
  import Map from "./Map.svelte";
  import ParcelHistory from "./ParcelHistory.svelte";
  import Form from "./Form.svelte";
  import { onDestroy } from "svelte";

  /* 
   * Tracking Numbers
   * 4010765063638021
   * 392404625680
   * 4337360760364248
   */

  let collapsed = true;
  
  let width = 0;
  let showMenu = false;
  $: isMobile = width < 768;
  $: {
    if (isMobile) {
      showMenu = !collapsed;
    } else {
      showMenu = true;
    }
  }

  let src = "/images/arrow.svg";

  const currentYear = new Date().getFullYear();

  function collapse() {
    collapsed = !collapsed;
  }

  const unsubscribe = parcelData.subscribe(function(value) {
    collapsed = value == null;
  });

  function collapseChanged(e) {
    menuHeight.update(() => e.target.clientHeight);
  }

  onDestroy(unsubscribe);
</script>

<svelte:window bind:innerWidth={width} />

<style>
  .container {
    height: 100vh;
    display: grid;
  }

  @media only screen and (max-width: 768px) {
    .container {
      grid-template-rows: 1fr auto;
    }

    .menu {
      grid-template-rows: 1fr auto;
    }
  }

  /* Medium and up */
  @media only screen and (min-width: 768px) {
    .container {
      grid-template-columns: minmax(350px, 25%) 1fr;
      grid-template-rows: auto;
      grid-template-areas: "menu main";
    }

    .collapse-button {
      visibility: hidden;
    }

    .menu {
      grid-area: menu;
      grid-template-rows: auto 1fr auto;
    }

    .menu img.logo {
      width: 25px;
      height: 25px;
      margin: 0 16px;
    }

    .menu header {
      width: 100%;
      padding: 16px;
      display: flex;
      background: var(--light);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    main {
      grid-area: main;
    }
  }

  .menu {
    display: grid;
    overflow: hidden;
  }

  main {
    position: relative;
    border-bottom: 2px #1a1a1a solid;
  }

  img {
    max-height: 100%;
  }

  .btn,
  .btn:focus {
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

  footer {
    text-align: center;
    padding: 4px;
    font-style: italic;
    color: var(--dark-grey);
  }

  footer a {
    color: var(--dark-grey);
    transition: 200ms ease-in-out;
  }

  footer a:hover {
    color: var(--medium-blue);
  }
</style>

<div class="loading {$loading ? 'active' : ''}">
  <img class="spinner" src="/images/spinner.svg" alt="loading spinner" />
</div>

<div class="container">
  <main>

    <Form />

    <Map />
    <div
      class="collapse-button btn {collapsed ? 'collapsed' : ''}"
      on:click={collapse}>
      <img {src} alt="" />
    </div>
  </main>

  {#if showMenu === true}
    <section 
      class="menu" 
      transition:slide >

      {#if !isMobile}
        <header>
          <img class="logo" src="/favicon.png" alt="logo">
          <h1>Parcel Tracker</h1>
        </header>
      {/if}

      <ParcelHistory />

      <footer> 
        <small>
          &copy; Copyright { currentYear }, <a href="https://everettblakley.ca">Everett Blakley</a>
        </small> 
      </footer> 
    </section>
  {/if}
</div>
