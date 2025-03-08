<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  let profileData = fetch("https://api.github.com/users/hap196");
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
<h1>Hailey Pan</h1>
<p>
  I'm a student at MIT majoring in Computer Science. Outside of school, I enjoy
  going to Hackathons, exploring new restaurants/cafes in Boston, reading, and
  photography.
</p>
<img
  src="/images/hackatbrown.jpg"
  alt="Me with friends at the Hack at Brown Hackathon"
/>

{#await fetch("https://api.github.com/users/hap196")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl class="github-stats">
        <dt>FOLLOWERS</dt>
        <dd>{data.followers}</dd>

        <dt>FOLLOWING</dt>
        <dd>{data.following}</dd>

        <dt>PUBLIC REPOS</dt>
        <dd>{data.public_repos}</dd>

        <dt>PUBLIC GISTS</dt>
        <dd>{data.public_gists}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>

<style>
  section {
    border: 1px solid color-mix(in srgb, currentColor, transparent 70%);
    border-radius: 6px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    margin-bottom: 2rem;
    background-color: color-mix(in srgb, currentColor, transparent 95%);
  }

  .github-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
</style>
