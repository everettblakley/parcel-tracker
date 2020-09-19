<script>
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

  function clear() {
    console.log("Clearing..");
    parcelData.set(undefined);
  }
</script>

<style>
  .container {
    padding: 2rem 0;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    margin: 0 2rem 1rem;
  }

  button.btn {
    background: var(--light);
    border: 1px var(--dark-blue) solid;
    border-radius: 4px;
    padding: 8px;
    margin-left: auto;
    cursor: pointer;
    transition: 100ms ease-in-out;
  }

  button.btn:hover {
    background: var(--dark-blue);
    border: 1px var(--dark) solid;
    color: var(--light);
  }

  .items {
    padding: 0 2rem;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;

    scrollbar-color: var(--dark-blue) var(--light);
    scrollbar-width: thin;
  }

  div.item {
    display: grid;
    grid-template-rows: 1fr 1fr;
    flex: 1 0;
    padding: 1rem;
    background: var(--light-grey);
    min-width: 150px;
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
    background: var(--dark-blue);
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
    display: grid;
    grid-template-rows: repeat(4, auto);
  }

  p.status {
    padding: 8px 0;
    font-size: 14px;
  }

  p.date {
    font-size: 10px;
    align-self: end;
  }

  p.time {
    font-size: 10px;
    font-style: italic;
    align-self: end;
  }

  .dot {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--medium-blue);
    margin: 25px auto;
    transition: 200ms ease-in-out;
  }
</style>

<div class="container">
  {#if $parcelData}
    {#each Object.keys($parcelData) as carrier}
      <div class="header">
        <h3>Delivered by: {carrier}</h3>
        <button class="btn" on:click={clear}>Clear</button>
      </div>
      <div class="items">
        {#each $parcelData[carrier] as item, index}
          <div
            class="item {item.selected ? 'selected' : ''}"
            on:click={selectItem(carrier, index)}>
            <div class="timeline-component">
              <div class="dot" />
            </div>
            <div class="details">
              {#if item.location}
                <p class="place-name">
                  {item.location.city}{item.location.state ? ", " + item.location.state : ""}
                </p>
              {/if}
              <p class="status">{item.status}</p>
              <p class="date">
                {moment(item.timestamp).format("dddd, MMMM Do YYYY")}
              </p>
              <p class="time">{moment(item.timestamp).format("h:mm:ss a")}</p>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  {:else}
    <div class="header">
      <p>
        Enter in a Tracking Number above. If found, the details will show up
        here
      </p>
    </div>
  {/if}
</div>
