<script lang="ts">
  import { slide } from "svelte/transition";
  import { parcelData } from "./stores";
  import type { ParcelData, Feature } from "./types";

  export let feature: Feature;
  export let carrier: string;

  function selectItem() {
    parcelData.update((oldData: ParcelData) => {
      oldData[carrier].featureCollection.features.forEach((value, i) => {
        value.properties.selected =
          i === feature.id ? !value.properties.selected : false;
      });
      return oldData;
    });
  }

  let isExpandable: boolean;
  $: isExpandable = feature.properties?.location !== "";

  let timeframe: string = "";
  $: {
    const events = feature.properties.events;
    if (events.length > 1) {
      const firstDate = events[0].timestamp;
      const lastDate = events[events.length - 1].timestamp;
      if (firstDate.isSame(lastDate, "day")) {
        timeframe = firstDate.format("dddd, MMMM Do, YYYY");
      } else {
        timeframe = `${firstDate.format("dddd, MMMM Do")} - ${lastDate.format(
          "Do, YYYY"
        )}`;
      }
    } else {
      if (feature.properties.location !== "") {
        timeframe = events[0].timestamp.format("dddd, MMMM Do, YYYY");
      } else {
        timeframe = events[0].timestamp.format(
          "dddd, MMMM Do, YYYY [at] h:mm a"
        );
      }
    }
  }
</script>

<style>
  .item {
    display: grid;
    padding: 12px 8px;
    grid-template-columns: auto 1fr auto;
    grid-gap: 8px;
    align-items: center;
    flex: 1 0;
    word-wrap: break-word;
    transition: 300ms ease-in-out;
    color: var(--dark-blue);
    cursor: pointer;
    counter-increment: item;
  }

  .item:not(:first-child) {
    margin-top: 8px;
  }

  .item:hover,
  .item.selected {
    background: var(--light);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .item.selected .dot {
    transform: scale(1.5);
  }

  .item.selected + .children {
    margin-bottom: 8px;
  }

  div.details {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  p.timeframe,
  li p:last-of-type {
    font-style: italic;
    font-size: 12px;
    color: var(--dark-grey);
    margin-top: 4px;
  }

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--medium-blue);
    margin: 12px;
    transition: 200ms ease-in-out;
    margin-right: 0;
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

  .children li {
    padding: 8px;
  }

  li p:first-of-type {
    font-size: 15px;
  }

  li .dot::after {
    content: counter(item);
    font-size: 14px;
    color: var(--light);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>

<li
  on:click={selectItem}
  class="item {feature.properties.selected ? 'selected' : ''}">
  {#if !feature.geometry || feature.geometry.type === 'Point'}
    <div class="dot" />
    <div class="details">
      <p class="place-name">
        {feature.properties.location ? feature.properties.location.toString() : feature.properties.events[0].status}
      </p>
      <p class="timeframe">{timeframe}</p>
    </div>
    {#if isExpandable}<img src="/images/arrow.svg" alt="dropdown arrow" />{/if}
  {/if}
</li>
{#if feature.geometry.type === 'Point' && feature.properties.selected && isExpandable}
  <div class="children" transition:slide>
    <ul>
      {#each feature.properties.events as event}
        <li>
          <p>{event.status}</p>
          <p>{event.timestamp.format('dddd, MMMM Do, YYYY [at] h:mm a')}</p>
        </li>
      {/each}
    </ul>
  </div>
{/if}
