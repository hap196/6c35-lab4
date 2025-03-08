<script>
  import { page } from "$app/stores";
  let pages = [
    { url: "./", title: "Home" },
    { url: "./projects", title: "Projects" },
    { url: "./contact", title: "Contact" },
    { url: "./cv", title: "CV" },
    { url: "https://github.com/hap196", title: "GitHub" },
  ];
</script>

<nav>
  {#each pages as p}
    <a
      href={p.url}
      class:current={"." + $page.route.id === p.url}
      target={p.url.startsWith("http") ? "_blank" : null}
    >
      {p.title}
    </a>
  {/each}
</nav>

<slot />

<label class="color-scheme">
  Theme:
  <select>
    <option value="light dark">Auto</option>
    <option value="dark">Dark</option>
    <option value="light">Light</option>
  </select>
</label>

<style>
  /* STEP 2: Styling the navigation bar */

  /* 
 Step 2.1: Getting <ul> and <li> out of the way
 "display: contents" removes default styling while keeping semantic structure 
 (you do not need to make any changes here for step 2.1, but please take note of it!)
*/
  nav ul,
  nav li {
    display: contents;
  }

  /* Step 2.2: Apply Flexbox to the navigation */
  nav {
    display: flex; /* Turns nav into a flex container */
    --border-color: oklch(50% 10% 200 / 40%);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
  }

  /* Step 2.3: Style navigation links for each element <a> */
  nav a {
    flex: 1;
    text-decoration: none;
    color: inherit;
    text-align: center;
    padding: 0.5em;
  }
  /* NOTE: please make sure that in each index.html page you add class="current" to the current page*/
  /* For example:  <a href="index.html" class="current">Home</a> */

  nav a.current {
    border-bottom: 0.4em solid var(--border-color);
    padding-bottom: 0.1em;
  }

  /* Before jumping to the next step, remember to complete wtep 2.3 by editing 'nav' */

  /* 
 Step 2.4: Accent color and hover styles
*/
  nav a:hover {
    border-bottom: 0.4em solid var(--color-accent);
    background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
  }

  .color-scheme {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    gap: 4px;
    font-size: 80%;
  }

  label {
  margin-block: 0.5rem;
}
</style>
