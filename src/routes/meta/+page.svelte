<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import {
    computePosition,
    autoPlacement,
    offset,
  } from '@floating-ui/dom';
  import Bar from '$lib/Bar.svelte';

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
  let clickedCommits = [];
  
  // Elements for binding
  let xAxis;
  let yAxis;
  let yAxisGridlines;
  let commitTooltip;
  
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
  
  // Scale for radius based on number of lines edited
  $: minMaxLines = commits.length ? d3.extent(commits, d => d.totalLines) : [0, 0];
  $: rScale = d3.scaleSqrt()
                .domain(minMaxLines)
                .range([2, 30]);
  
  // Prepare data for Bar chart
  $: allTypes = Array.from(new Set(data.map(d => d.type)));
  $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
  $: selectedCounts = d3.rollup(
    selectedLines,
    v => v.length,
    d => d.type
  );
  $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);
                
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

  let hoveredIndex = -1;
  let tooltipPosition = {x: 0, y: 0};
  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
  
  async function dotInteraction(index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement() // see https://floating-ui.com/docs/autoplacement
        ],
      });
    }
    else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    }
    else if (evt.type === "click") {
      let commit = commits[index];
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      }
      else {
        // Remove the commit from the array
        clickedCommits = clickedCommits.filter(c => c !== commit);
      }
      console.log(clickedCommits);
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
      
    // Sort commits by total lines in descending order
    commits = d3.sort(commits, d => -d.totalLines);

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
          class:selected={clickedCommits.includes(commit)}
          on:mouseenter={evt => dotInteraction(index, evt)}
          on:mouseleave={evt => dotInteraction(index, evt)}
          on:click={evt => dotInteraction(index, evt)}
          on:keydown={evt => evt.key === 'Enter' && dotInteraction(index, {...evt, type: "click"})}
          tabindex="0"
          role="button"
          aria-label={`Commit ${commit.id.substring(0, 7)} by ${commit.author} with ${commit.totalLines} lines on ${commit.date}`}
          cx={xScale(commit.datetime)}
          cy={yScale(commit.hourFrac)}
          r={rScale(commit.totalLines)}
          fill-opacity={hoveredIndex === index ? 1 : 0.6}
          fill="steelblue"
        />
      {/each}
    </g>
  </svg>
</section>

<Bar data={languageBreakdown} width={width} />

<div class="tooltip" bind:this={commitTooltip} hidden={hoveredIndex === -1} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px">
  <dt>COMMIT</dt>
  <dd><a href="{hoveredCommit.url}" target="_blank">{hoveredCommit.id?.substring(0, 7)}</a></dd>
  
  <dt>AUTHOR</dt>
  <dd>{hoveredCommit.author}</dd>
  
  <dt>DATE</dt>
  <dd>{hoveredCommit.datetime?.toLocaleDateString("en", {month: "long", day: "numeric", year: "numeric"})}</dd>
  
  <dt>TIME</dt>
  <dd>{hoveredCommit.datetime?.toLocaleTimeString("en", {hour: "2-digit", minute: "2-digit"})}</dd>
  
  <dt>LINES</dt>
  <dd>{hoveredCommit.totalLines}</dd>
</div>

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
    color: #333;
  }
  
  .gridlines {
    stroke-opacity: .2;
    stroke: #333;
  }
  
  .gridlines line {
    stroke: #333;
  }
  
  .x-label, .y-label {
    font-size: 12px;
    fill: #333;
    font-weight: bold;
  }

  svg text {
    fill: #333;
  }

  svg line, svg path {
    stroke: #333;
  }

  .visualization {
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }
  
  /* Complete rewrite of tooltip styles to avoid conflicts */
  .tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
    background: oklch(100% 0% 0 / 90%);
    padding: 1.5em;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.15);
    z-index: 100;
    max-width: 300px;
    min-width: 200px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75em 1em;
    color: black;
    font-family: system-ui, sans-serif;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition-duration: 500ms;
    transition-property: opacity, visibility;
  }
  
  .tooltip[hidden]:not(:hover, :focus-within) {
    opacity: 0;
    visibility: hidden;
  }
  
  .tooltip dt {
    grid-column: 1;
    display: block;
    text-align: right;
    color: #555;
    font-size: 0.75rem;
    font-weight: bold;
    margin: 0;
    line-height: 1.5;
    grid-row: auto;
  }
  
  .tooltip dd {
    grid-column: 2;
    display: block;
    font-size: 0.9rem;
    font-weight: normal;
    margin: 0;
    line-height: 1.5;
    word-break: break-word;
    grid-row: auto;
    color: #333;
  }
  
  .tooltip a {
    color: steelblue;
    text-decoration: none;
  }
  
  .tooltip a:hover {
    text-decoration: underline;
  }

  .selected {
    fill: var(--color-accent);
  }
</style>
