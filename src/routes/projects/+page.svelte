<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  import Pie from '$lib/Pie.svelte';
  import * as d3 from "d3";

  let query = "";  // Add search query variable
  let selectedYearIndex = -1;

  // Add reactive filtering of projects with case-insensitive search across all metadata
  $: filteredProjects = projects.filter(project => {
    let values = Object.values(project).join("\n").toLowerCase();
    return values.includes(query.toLowerCase());
  });

  // Define selected year based on selectedYearIndex
  let selectedYear;
  $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

  // Make pieData reactive based on filteredProjects
  let pieData;
  $: {
    let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
    pieData = rolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
  }

  // Filter projects by selected year
  $: filteredByYear = filteredProjects.filter(project => {
    if (selectedYear) {
      return project.year === selectedYear;
    }
    return true;
  });
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<input 
  type="search" 
  bind:value={query}
  aria-label="Search projects" 
  placeholder="🔍 Search projects…" 
/>

<!-- <p>Selected Year Index: {selectedYearIndex}, Selected Year: {selectedYear}</p> -->

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<div class="projects">
  {#each filteredByYear as p}
    <Project data={p} />
  {/each}
  <!-- <article>
    <h2>Amet totam debitis temporibus.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Odit praesentium sed rerum, voluptate cumque iste blanditiis labore quos
      itaque dolor quod facilis similique, atque corrupti debitis, tempore
      voluptates aliquid dolore perferendis esse harum ab id consectetur.
      Inventore, eius?
    </p>
  </article>
  <article>
    <h2>Omnis maiores voluptas ex.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      In accusantium delectus nostrum corrupti ipsum, voluptate non vitae ipsam
      facilis harum inventore maxime libero, dolorum provident cupiditate totam,
      natus culpa? Pariatur, voluptatibus ex! Est reiciendis in eum officiis
      nostrum!
    </p>
  </article>
  <article>
    <h2>Veniam odio eveniet aspernatur.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Accusantium nesciunt minima temporibus consequuntur sed similique
      architecto natus magni, repellat qui omnis rem! Quas sunt doloremque quasi
      quam, incidunt expedita non earum. Harum odit a perspiciatis natus,
      veritatis sapiente?
    </p>
  </article>
  <article>
    <h2>Excepturi ut minima natus.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Asperiores magni ipsa eius id earum in hic, iste architecto aliquid labore
      impedit fuga repudiandae excepturi recusandae tenetur. Ea, corporis quo.
      Ad, officia? Magni harum quos natus alias. Autem, eius!
    </p>
  </article>
  <article>
    <h2>Ab fuga quia quos.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Quibusdam odit laboriosam voluptas voluptatem numquam impedit, ullam
      similique vitae, expedita molestiae quasi laborum, facilis tempore.
      Aspernatur ipsum assumenda perferendis molestiae. Asperiores harum error
      porro necessitatibus. Saepe sit officia laudantium.
    </p>
  </article>
  <article>
    <h2>Rerum aspernatur quaerat cupiditate?</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Vero at, quod saepe voluptate non atque obcaecati! Iste laudantium, vitae
      magnam consectetur, at, excepturi delectus mollitia corrupti eum natus nam
      beatae ea perspiciatis non laboriosam pariatur nemo esse neque.
    </p>
  </article>
  <article>
    <h2>Sed aut tenetur laudantium.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Aliquid aliquam libero, quo tenetur placeat laudantium mollitia quos
      voluptates assumenda temporibus repellat earum! Fugiat, est. Nisi
      voluptate illum harum. Minus incidunt harum maxime rem repudiandae hic
      voluptatum laborum. Pariatur.
    </p>
  </article>
  <article>
    <h2>Fugiat beatae cum qui!</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Officiis cum doloremque commodi eum dolore voluptatibus, aliquid qui quasi
      eveniet distinctio unde! Esse magni dicta perspiciatis temporibus
      provident distinctio minima amet reiciendis inventore? Neque blanditiis
      cumque explicabo consequatur vitae!
    </p>
  </article>
  <article>
    <h2>Quisquam ipsa error unde?</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Blanditiis, doloribus distinctio ad neque ratione voluptas. Dolor cum
      officiis illum ex ipsam eius repudiandae harum? Neque animi repudiandae
      corrupti quod. Ut aperiam dicta, aut facilis at soluta excepturi.
      Pariatur?
    </p>
  </article>
  <article>
    <h2>Nam, quisquam rem? Error.</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Optio nulla inventore exercitationem quod quo illo totam sapiente maiores
      impedit tempora cum et molestiae dolor, ducimus ipsa deserunt vel fuga.
      Rerum esse illo quae nisi laudantium et. Modi, molestiae.
    </p>
  </article>
  <article>
    <h2>Aut dolores eos possimus!</h2>
    <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="" />
    <p>
      Consectetur, molestiae iusto. Voluptates dolore ipsum doloribus eveniet
      ullam magni repudiandae temporibus labore sit maiores et fuga
      necessitatibus, distinctio itaque adipisci odit quod saepe corrupti, nobis
      id harum! Fugit, non!
    </p>
  </article> -->
</div>

<style>
  input[type="search"] {
    width: 100%;
    padding: 0.5em;
    margin-bottom: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
  }
</style>
