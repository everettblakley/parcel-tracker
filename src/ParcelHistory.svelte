<script>
  import { slide } from "svelte/transition";
  import moment from "moment";
  import { parcelData } from "./stores";

  function selectItem(carrier, index) {
    parcelData.update((oldData) => {
      oldData[carrier].forEach((value, i) => {
        value.selected = i === index ? !value.selected : false;
      });
      return oldData;
    });
  }

  function locationName(location) {
    if (typeof location === "string") {
      return location;
    }
    return `${location.city}${location.state ? ", " + location.state : ""}`;
  }

  function drawPoint(item) {
    if (item.feature) {
      return item.feature.geometry && item.feature.geometry.type === "Point";
    }
    return true;
  }
</script>

<style>
  .container {
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    
    scrollbar-color: var(--dark-blue) var(--light);
    scrollbar-width: thin;
  }

  .items {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .items::after {
    position: absolute;
    background: var(--medium-blue);
    width: 2px;
    content: " ";
    top: 50px;
    bottom: 50px;
    margin-left: 28px;
  }
  
  div.item {
    display: grid;
    padding: 1rem;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    flex: 1 0;
    word-wrap: break-word;
    transition: 300ms ease-in-out;
    color: var(--dark-blue);
    cursor: pointer;
  }

  div.item:hover,
  div.item.selected {
    background: var(--light);
  }

  div.item.selected .dot {
    transform: scale(1.5);
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

  div.details {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 0 16px;
  }

  p.status {
    padding: 8px 0;
    font-size: 14px;
  }

  p.datetime {
    font-size: 10px;
  }

  .dot {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--medium-blue);
    margin: 25px auto;
    transition: 200ms ease-in-out;
  }

  .item img {
    transition: 200ms ease-in-out;
  }

  .item.selected img {
    transform: rotate(180deg);
  }

  .children {
    padding: 1rem;
    background: #f9f9f9;
  }

  .children ul {
    padding-left: 24px;
  }

  li::marker {
    color: var(--medium-blue);
  }
</style>

<div class="container">
  {#if $parcelData}
    {#each Object.keys($parcelData) as carrier}
      <h3>Delivered by: { carrier }</h3>
      <div class="items">
        {#each $parcelData[carrier] as item, index}
          {#if drawPoint(item)}
            <div
              class="item {item.selected ? 'selected' : ''}"
              on:click={selectItem(carrier, index)}>
              <div class="timeline-component">
                <div class="dot" />
              </div>
              <div class="details">
                {#if item.location}
                  <p class="place-name">
                    {locationName(item.location)}
                  </p>
                {/if}
                <p class="status">{item.status}</p>
                <p class="datetime">{moment(item.timestamp).format("h:mm:ss a")}</p>
              </div>
              <img src="/images/arrow.svg" alt="dropdown arrow">
            </div>

            {#if item.selected}
              <div class="children" transition:slide>
                <ul>
                  <li>Thing 1</li>
                  <li>Thing 2</li>
                  <li>Thing 3</li>
                </ul>
              </div>
            {/if}
            {/if}
        {/each}
      </div>
    {/each}
  {:else}
    <p>
      Enter your tracking number into the form! Once we get the data, the details will show up here
    </p>
  {/if}
</div>
