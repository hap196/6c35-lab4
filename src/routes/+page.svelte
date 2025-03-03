<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
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
<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>
