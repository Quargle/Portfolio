
<script lang="ts">
  import ProjectTile from "./ProjectTile.svelte";
  const projects:Array<object> = [];

  const tribute:object = {
    id: "tribute",
    link: "https://quargle.github.io/static_pages/Greta.html",
    title: "Tribute Page",
    text: "A sample tribute page",
    tools: "HTML and CSS",
    image: 'logos/greta-tribute.png',
  }
  projects.push(tribute);

  const squirrels:object = {
    id: "squirrels-rest",
    link: "https://quargle.github.io/squirrels-rest/",
    title: "Squirrel's Rest",
    text: "An example of static pages based on HTML and CSS alone.",
    tools: "HTML and CSS",
    image: 'logos/squirrel-opaque.png',
  }
  projects.push(squirrels);

  const surveyForm:object = {
    id: "survey-form",
    link: "https://quargle.github.io/static_pages/survey_form.html",
    title: "Survey Form",
    text: "A simple form written in HTML and CSS",
    tools: "HTML and CSS",
    image: 'logos/survey-form-opaque.png',
  }
  projects.push(surveyForm);

  const drumkit:object = {
    id: "drumkit",
    link: "https://quargle.github.io/Games/Drumkit/drumkit.html",
    title: "Drumkit",
    text: "A JavaScript Drumkit",
    tools: "JavaScript, HTML and CSS",
    image: 'logos/drumkit.png',
  }
  projects.push(drumkit);

  const sketch:object = {
    id: "etch-a-sketch",
    link: "https://quargle.github.io/Games/Etch-a-Sketch/sketch.html",
    title: "Etch-a-Sketch",
    text: "",
    tools: "JavaScript, HTML and CSS",
    image: 'logos/sketch.png',
  }
  projects.push(sketch);

  const svelteCounter:object = {
    id: "svelte-counter",
    link: "https://quargle.github.io/svelte-project/public/",
    title: "Svelte Counter",
    text: "A simple counter that can be incremented and decremented",
    tools: "Svelte",
    image: "logos/svelte-counter.png"
    //image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg"
  }
  projects.push(svelteCounter);

  const reactCounter:object = {
    id: "react-counter",
    link: "",
    title: "React Counter",
    text: "This doesn't actually link to anything yet",
    tools: "React",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  }
  projects.push(reactCounter);

</script>


<section id="projects-section">
    <div id="projects-header">
        <h1>PROJECTS</h1>
    </div>

  <div class="projects-content">
    {#each projects as project }
      <ProjectTile project={project} />
    {/each}
</section>

<!-- TODO: make the product page not rubbish
      <a id="product-page" class="project-tile" target="_blank" href="https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Product_landing_page/product_landing_page.html">
        <h3>Product Landing Page (WIP)</h3>
        <p>Get your plutionum here</p>
      </a>
-->

<!-- TODO: is the games index necessary?
      <a id="js-games" 
      class="project-tile" 
      target="_blank" 
      href="https://quargle.github.io/Games/index.html"
      >
        <h3>Javascript Games</h3>
        <p>A selection of simple games created using Javascript and CSS</p>  
      </a>
    -->

<style>
  #projects-header{
    width: 100%;
    margin: 0;
    padding: 75px 0px;  /* this is to counter the navbar when jumping to section */
    min-height: 10vw;
    background-color: var(--color-1);
    color:#a8dadc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 8rem;
    padding: 3rem;
    margin: 0;
    text-align: center;
  }



  .projects-content {
    display: flex;
    justify-content:space-evenly;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    padding: 3em;
    background-color: #457b9d;
  }

</style>