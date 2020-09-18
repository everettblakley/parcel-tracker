<script>
  import moment from "moment";
  export let data;

  function transformCarrierName(name) {
    console.log(name);
    return name;
  }
</script>

<style>
  .container {
    padding: 2rem 0;
    overflow: hidden;
  }

  .container > h3 {
    margin: 0 2rem 1rem;
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
  }

  div.item:hover {
    background: var(--light-blue);
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
    cursor: pointer;
  }

  .dot:hover {
    background: var(--dark-blue);
    transform: scale(1.5);
  }
</style>

<div class="container">
  {#if data}
    {#each Object.keys(data) as carrier}
      <h3>Delivered by: {transformCarrierName(carrier)}</h3>
      <div class="items">
        {#each data[carrier] as item}
          <div class="item">
            <div class="timeline-component">
              <div class="dot" />
            </div>
            <div class="details">
              {#if item.location}
                <p class="place-name">
                  {item.location.city}{item.location.state ? ', ' + item.location.state : ''}
                </p>
              {/if}
              <p class="status">{item.status}</p>
              <p class="date">
                {moment(item.timestamp).format('dddd, MMMM Do YYYY')}
              </p>
              <p class="time">{moment(item.timestamp).format('h:mm:ss a')}</p>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  {:else}
    <p>Nothing to see here...</p>
  {/if}
</div>
