<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";

  let width = 1000, height = 600;
  // Define margins
  let margin = {top: 10, right: 10, bottom: 30, left: 50};
  
  // Define usable area
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;
  
  let data = [];
  let commits = [];
  
  // Elements for binding
  let xAxis;
  let yAxis;
  let yAxisGridlines;
  
  // Calculate statistics reactively
  $: totalLOC = data.length;
  $: commitCount = commits.length;
  
  // Calculate number of unique files
  $: files = d3.groups(data, d => d.file).length;
  
  // Calculate maximum depth
  $: maxDepth = d3.max(data, d => +d.depth) || 0;
  
  // Calculate maximum file length (lines per file)
  $: fileLengths = d3.rollups(data, v => v.length, d => d.file);
  $: maxLines = d3.max(fileLengths, d => d[1]) || 0;

  // Create scales for the scatterplot
  $: minDate = commits.length ? d3.min(commits, d => d.datetime) : new Date();
  $: maxDate = commits.length ? d3.max(commits, d => d.datetime) : new Date();
  $: maxDatePlusOne = new Date(maxDate);
  $: {
    if (maxDatePlusOne instanceof Date && !isNaN(maxDatePlusOne)) {
      maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
    }
  }

  $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

  $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);
                
  // Create and update axes reactively
  $: {
    if (yAxisGridlines) {
      d3.select(yAxisGridlines).call(
        d3.axisLeft(yScale)
          .tickFormat("")
          .tickSize(-usableArea.width)
      );
    }
    
    if (xAxis) {
      d3.select(xAxis).call(d3.axisBottom(xScale));
    }
    
    if (yAxis) {
      d3.select(yAxis).call(
        d3.axisLeft(yScale)
          .tickFormat(d => String(d % 24).padStart(2, "0") + ":00")
      );
    }
  }

  onMount(async () => {
    data = await d3.csv("/loc.csv");
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;

        // Convert datetime string to a proper Date object
        let dateObj = new Date(`${date}T${time}${timezone}`);

        let ret = {
          id: commit,
          url: "https://github.com/vis-society/lab-7/commit/" + commit,
          author,
          date,
          time,
          timezone,
          datetime: dateObj, // Store the Date object
          hourFrac: dateObj.getHours() + dateObj.getMinutes() / 60,
          totalLines: lines.length,
        };

        // Like ret.lines = lines
        // but non-enumerable so it doesn't show up in JSON.stringify
        Object.defineProperty(ret, "lines", {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });

        return ret;
      });

    console.log(commits);
  });
</script>

<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>

<section class="summary">
  <h2>Summary</h2>
  <dl class="stats">
    <dt>COMMITS</dt>
    <dd>{commitCount}</dd>
    
    <dt>FILES</dt>
    <dd>{files}</dd>
    
    <dt>TOTAL <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{totalLOC}</dd>
    
    <dt>MAX DEPTH</dt>
    <dd>{maxDepth}</dd>
    
    <dt>MAX LINES</dt>
    <dd>{maxLines}</dd>
  </dl>
</section>

<section class="visualization">
  <h2>Commits by time of day</h2>
  <svg viewBox="0 0 {width} {height}">
    <!-- Grid lines -->
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    
    <!-- X-axis at the bottom -->
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    
    <!-- Y-axis on the left -->
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    
    <!-- Add axis labels -->
    <text 
      class="x-label" 
      x={width / 2} 
      y={height - 5} 
      text-anchor="middle"
    >
      Date
    </text>
    
    <text 
      class="y-label" 
      transform="rotate(-90)" 
      x={-height / 2} 
      y={15} 
      text-anchor="middle"
    >
      Time of Day
    </text>
    
    <!-- Data points -->
    <g class="dots">
      {#each commits as commit, index}
        <circle
          cx={xScale(commit.datetime)}
          cy={yScale(commit.hourFrac)}
          r="5"
          fill="steelblue"
        />
      {/each}
    </g>
  </svg>
</section>

<!-- <section class="commits">
  <h2>Commit History</h2>
  {#each commits as commit, i}
    <div class="commit">
      <span class="index">{i + 1}:</span>
      {JSON.stringify(commit, null, 2)}
    </div>
  {/each}
</section> -->

<style>
  .summary {
    margin-bottom: 2rem;
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-top: 1px solid color-mix(in srgb, currentColor, transparent 70%);
    padding-top: 1.5rem;
    margin-bottom: 2rem;
  }

  dt {
    grid-row: 1;
    font-size: 0.875rem;
    color: color-mix(in srgb, currentColor, transparent 40%);
    margin-bottom: 0.5rem;
  }

  dd {
    grid-row: 2;
    font-size: 2rem;
    font-weight: 300;
    margin: 0;
    color: currentColor;
  }

  svg {
    width: 100%;
    height: auto;
    overflow: visible;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
  }
  
  .gridlines {
    stroke-opacity: .2;
  }
  
  .x-axis path, .y-axis path,
  .x-axis line, .y-axis line {
    stroke: #888;
  }
  
  .x-axis text, .y-axis text {
    font-size: 10px;
    fill: #555;
  }
  
  .x-label, .y-label {
    font-size: 12px;
    fill: #333;
    font-weight: bold;
  }

  .visualization {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .commits {
    font-family: monospace;
    white-space: pre;
    overflow-x: auto;
    padding: 1em;
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  .commit {
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .index {
    font-weight: bold;
    margin-right: 8px;
  }
</style>
