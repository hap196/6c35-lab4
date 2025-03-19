<script>
  import * as d3 from "d3";

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });

  export let data = [];
  export let selectedIndex = -1;

  let sliceGenerator = d3.pie().value((d) => d.value);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Make arcData and arcs reactive
  let arcData;
  let arcs;

  $: {
    arcData = sliceGenerator(data);
    arcs = arcData.map((d) => arcGenerator(d));
  }
</script>

<div class="container">
  <svg viewBox="-50 -50 100 100" style="width: 200px; height: 200px;">
    {#each arcs as arc, index}
      <path 
        d={arc} 
        fill={colors(index)}
        class:selected={selectedIndex === index}
        on:click={e => selectedIndex = selectedIndex === index ? -1 : index}
      />
    {/each}
  </svg>

  <ul class="legend">
    {#each data as d, index}
      <li 
        style="--color: { colors(index) }"
        class:selected={selectedIndex === index}
        on:click={e => selectedIndex = selectedIndex === index ? -1 : index}
      >
        <span class="swatch"></span>
        {d.label} <em>({d.value})</em>
      </li>
    {/each}
  </ul>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    gap: 2em;
  }

  svg {
    margin-block: 2em;
    overflow: visible;
  }

  path {
    transition: 300ms;
    cursor: pointer;
  }

  path:hover {
    opacity: 100% !important;
  }

  svg:has(path:hover) path:not(:hover) {
    opacity: 50%;
  }

  /* When a path is selected, make all non-selected paths 50% opacity */
  svg:has(.selected) path:not(.selected) {
    opacity: 50%;
  }

  .selected {
    --color: oklch(60% 45% 0) !important;
    
    &:is(path) {
      fill: var(--color) !important;
    }
    
    &:is(li) {
      color: var(--color);
    }
  }

  ul:has(.selected) li:not(.selected) {
    color: gray;
  }

  /* Legend styling */
  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    gap: 1em;
    padding: 1em;
    border: 1px solid black;
    margin-top: 2em;
    flex: 1;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
  }

  .swatch {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: var(--color);
    border-radius: 50%;
  }

  .legend em {
    margin-left: 0.25em;
  }
</style>
