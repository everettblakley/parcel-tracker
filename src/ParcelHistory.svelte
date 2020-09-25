<script lang="ts">
  import { slide } from "svelte/transition";
  import { parcelData } from "./stores";
  import type { ParcelData, Point, ITrackingEvent } from "./types";
  import { onDestroy } from "svelte";

  function selectItem(carrier, index) {
    parcelData.update((oldData : ParcelData) => {
      oldData[carrier].features.forEach((value, i) => {
        value.properties.selected = i === index ? !value.properties.selected : false;
      });
      return oldData;
    });
  }

  function isExpandable(item: Point): boolean {
    return item.properties?.location !== "";
  }

  function getTimeframe(point: Point): string {
    let output = "";
    const events: ITrackingEvent[] = point.properties.events;
    if (events.length > 1) {
      const firstDate = events[0].timestamp;
      const lastDate = events[events.length - 1].timestamp;
      if (firstDate.isSame(lastDate, "day")) {
        output = firstDate.format("dddd, MMMM Do, YYYY");
      } else {
        output = `${firstDate.format("dddd, MMMM Do")} - ${lastDate.format("Do, YYYY")}`
      }
    } else {
      if (point.properties.location !== "") {
        output = events[0].timestamp.format("dddd, MMMM Do, YYYY");
      } else {
        output = events[0].timestamp.format("dddd, MMMM Do, YYYY [at] h:mm a");
      }
    }

    return output;
  }

  function eventDate(timestamp: moment.Moment) {
    return timestamp.format("dddd, MMMM Do, YYYY [at] h:mm a")
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
  
  div.item {
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
  }

  div.item:not(:first-child) {
    margin-top: 8px;
  }

  div.item:hover,
  div.item.selected {
    background: var(--light);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  div.item.selected .dot {
    transform: scale(1.5);
  }

  div.item.selected + .children {
    margin-bottom: 8px;
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
  }

  p.timeframe,
  li p:last-of-type {
    font-style: italic;
    font-size: 12px;
    color: var(--dark-grey);
    margin-top: 4px;
  }

  .dot {
    width: 16px;
    height: 16px;
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
    padding: 8px
  }

  li p:first-of-type {
    font-size: 15px;
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
        {#each data[carrier].features as feature, index (feature.id)}
          {#if !feature.geometry || feature.geometry.type === "Point"}
            <div
              class="item {feature.properties.selected ? 'selected' : ''}"
              on:click={() => selectItem(carrier, index)}>
              <div class="dot"/>
              <div class="details">
                <p class="place-name">
                  {feature.properties.location ? feature.properties.location.toString() : feature.properties.events[0].status}
                </p>
                <p class="timeframe">
                  {getTimeframe(feature)}
                </p>
                <!-- <p class="status">{item.status}</p>
                <p class="datetime">{moment(item.timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p> -->
              </div>
              {#if isExpandable(feature)}
                <img src="/images/arrow.svg" alt="dropdown arrow">
              {/if}
            </div>
            {#if (feature.properties.selected && isExpandable(feature))}
              <div class="children" transition:slide>
                <ul>
                  {#each feature.properties.events as event}
                  <li>
                    <p>{event.status}</p>
                    <p>{eventDate(event.timestamp)}</p>
                  </li>
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
