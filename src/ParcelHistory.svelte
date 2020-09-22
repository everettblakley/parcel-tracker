<script lang="ts">
  import { slide } from "svelte/transition";
  import moment from "moment";
  import { parcelData } from "./stores";
  import type { Point, IEntity, ParcelData } from "./types";
  import { onDestroy } from "svelte";

  function selectItem(carrier, index) {
    parcelData.update((oldData) => {
      oldData[carrier].forEach((value, i) => {
        value.selected = i === index ? !value.selected : false;
      });
      return oldData;
    });
  }

  function isPoint(item: IEntity): item is Point {
    return (item as Point).location !== undefined;
  }

  let data: ParcelData;
  const unsubscribe = parcelData.subscribe((value) => {
    data = value as ParcelData;
  });

  onDestroy(unsubscribe);

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
  {#if data}
    {#each Object.keys(data) as carrier}
      <h3>Delivered by: { carrier }</h3>
      <div class="items">
        {#each data[carrier] as item, index (item.index)}
          {#if isPoint(item)}
            <div
              class="item {item.selected ? 'selected' : ''}"
              on:click={() => selectItem(carrier, index)}>
              <div class="timeline-component">
                <div class="dot" />
              </div>
              <div class="details">
                {#if item.location}
                  <p class="place-name">
                    {item.location.toString()}
                  </p>
                {/if}
                <!-- <p class="status">{item.status}</p>
                <p class="datetime">{moment(item.timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p> -->
              </div>
              <img src="/images/arrow.svg" alt="dropdown arrow">
            </div>

            {#if item.selected}
              <div class="children" transition:slide>
                <ul>
                  {#each item.events as event}
                  <li>{event.status + " " + event.timestamp}</li>
                  {/each}
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
