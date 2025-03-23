<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";

  let data = [];
  let commits = [];
  
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
