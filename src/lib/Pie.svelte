<script>
  import * as d3 from "d3";

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI,
  });

  export let data = [];

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
</script>

<div class="container">
  <svg viewBox="-50 -50 100 100">
    {#each arcs as arc, index}
      <path d={arc} fill={colors(index)} />
    {/each}
  </svg>

  <ul class="legend">
    {#each data as d, index}
      <li style="--color: { colors(index) }">
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
    max-width: 20em;
    margin-block: 2em;
    overflow: visible;
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
