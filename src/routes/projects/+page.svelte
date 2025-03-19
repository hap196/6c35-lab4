<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  import Pie from '$lib/Pie.svelte';
  import * as d3 from "d3";

  // Group projects by year and count them
  let rolledData = d3.rollups(projects, v => v.length, d => d.year);
  
  // Transform the data into the format needed for the pie chart
  let pieData = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<Pie data={pieData} />
<div class="projects">
  {#each projects as p}
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
