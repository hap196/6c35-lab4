<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";

  let data = [];
  let commits = [];

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

<p>This is the meta page.</p>
<p>Total lines of code: {data.length}</p>

<section class="commits">
  <h2>Commit History</h2>
  {#each commits as commit, i}
    <div class="commit">
      <span class="index">{i + 1}:</span>
      {JSON.stringify(commit, null, 2)}
    </div>
  {/each}
</section>

<style>
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
