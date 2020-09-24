<script lang="ts">
  import { slide } from "svelte/transition";
  import { parcelData, loading } from "./stores";
  import Map from "./Map.svelte";
  import ParcelHistory from "./ParcelHistory.svelte";
  import Form from "./Form.svelte";
  import { onDestroy } from "svelte";

  /* 
   * Tracking Numbers
   * 4010765063638021
   * 392404625680
   * 4337360760364248
   * 800772325813362256
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

  let innerHeight = 0;
  let outerHeight = 0;

  const currentYear = new Date().getFullYear();

  function collapse() {
    collapsed = !collapsed;
  }

  const unsubscribe = parcelData.subscribe(function(value) {
    collapsed = value == null;
  });

  // function collapseChanged(e) {
  //   menuHeight.update(() => e.target.clientHeight);
  // }

  onDestroy(unsubscribe);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={innerHeight} bind:outerHeight={outerHeight}/>

<style>
  .container {
    height: 100vh;
    display: grid;
  }

  @media only screen and (max-width: 768px) {
    .container {
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1 0;
      min-height: 60%;
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

    .menu-button {
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
    box-shadow: 0px -4px 8px 10px rgba(40, 40, 40, 0.1);
    z-index: 1;
  }

  main {
    position: relative;
  }

  img {
    max-height: 100%;
  }

  .btn,
  .btn:focus {
    border: none;
  }

  .menu-button {
    text-align: center;
    padding: 8px;
  }

  .menu-button img {
    transition: 200ms ease-in-out;
  }

  .menu-button.collapsed img {
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

  div.debug-text {
    position: absolute;
    left: 50%;
    bottom: 100px;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.1);
    padding: 8px;
    z-index: 1000;
  }
</style>

<div class="loading {$loading ? 'active' : ''}">
  <img class="spinner" src="/images/spinner.svg" alt="loading spinner" />
</div>

<div class="container {showMenu ? "" : "collapsed"}">
  <main>
    <Form />
    <Map />
  </main>

  <section class="menu">
  
    {#if !isMobile}
    <header>
      <img class="logo" src="/favicon.png" alt="logo">
      <h1>Parcel Tracker</h1>
    </header>
    {:else}
      <div class="menu-button btn {collapsed ? 'collapsed' : ''}" on:click={collapse}>
        <img {src} alt="menu button" />
      </div>
    {/if}

    {#if showMenu === true}
      <span transition:slide>

        <ParcelHistory />
        
        <footer> 
          <small>
            &copy; Copyright { currentYear }, <a href="https://everettblakley.ca">Everett Blakley</a>
          </small> 
        </footer> 
      </span>
    {/if}

    </section>
</div>
