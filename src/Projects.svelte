
<section id="projects-header-section">
    <div id="projects-header">
        <h1>PROJECTS</h1>
    </div>
</section>

<section class="project-category" id="static-pages">
    <div class="category-header" id="static-projects">
      <h2>Static Web Pages</h2>
      <h4>Made with pure HTML and CSS</h4>
    </div>
    <div class="category-content">

      <a id="squirrels-rest" class="project-tile" target="_blank" href="https://quargle.github.io/squirrels-rest/">
        <h3>Squirrel's Rest Refuge for Exhausted Squirrels</h3>
        <p>An example of static pages based on HTML and CSS alone.</p>
      </a>

      <a id="tribute" class="project-tile" target="_blank" href="https://quargle.github.io/static_pages/Greta.html">
        <h3>Tribute</h3>
        <p>A sample tribute page</p>
      </a>

      <a id="form" class="project-tile" target="_blank" href="https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Survey_form/survey_form.html">
        <h3>Survey Form</h3>
        <p>Soliciting donations for Ice Cream</p>
      </a>

      <a id="product-page" class="project-tile" target="_blank" href="https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Product_landing_page/product_landing_page.html">
        <h3>Product Landing Page (WIP)</h3>
        <p>Get your plutionum here</p>
      </a>

    </div>
  </section>

  <section class="project-category" id="javascript-pages-section">
    <div class="category-header" id="javascript-pages">
      <h2>Javascript Games</h2>
      <h4>Simple pages made with HTML, CSS and Vanilla Javascript</h4>
    </div>
    <div class="category-content">

      <a id="js-games" 
      class="project-tile" 
      target="_blank" 
      href="https://quargle.github.io/Games/index.html"
      >
        <h3>Javascript Games</h3>
        <p>A selection of simple games created using Javascript and CSS</p>  
      </a>

      <a id="drumkit-game" 
      class="project-tile" 
      target="_blank" 
      href="https://quargle.github.io/Games/Drumkit/drumkit.html"
      style="background-image: url('');">
        <h3>Drumkit</h3>
        <p>A JavaScript Drumkit</p>  
      </a>

      <a id="drumkit-game" 
      class="project-tile" 
      target="_blank" 
      href="https://quargle.github.io/Games/Etch-a-Sketch/sketch.html">
        <h3>Etch-a-Sketch</h3>
      </a>

    </div>
  </section>


  <section class="project-category" id="svelte-projects-section">
      <div class="category-header" id="svelte-projects">
        <h2>Svelte</h2>
        <h4>Applications made with the trendiest new JavaScript Framework</h4>
      </div>
      <div class="category-content">
        <a id="svelte-tile" 
          class="project-tile"
          href="https://quargle.github.io/svelte-project/public/" 
          target="_blank" 
          style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg'); background-color: white;">
          <h3>A Svelte Project</h3>
          <p>A simple counter that can be incremented</p>  
        </a>
      </div>
  </section>


  <section class="project-category" id="react-projects-section">
      <div class="category-header" id="react-projects">
        <h2>React</h2>
        <h4>Applications made with the world's most popular JavaScript Framework</h4>
      </div>
      <div class="category-content">
        <a id="react-tile" 
        class="project-tile"
        href="" 
        target="_blank" 
        style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'); background-color: white;">
          <h3>A React App</h3>
          <p>This doesn't actually link to anything yet</p>  
        </a>
      </div>
  </section>


<style>
#projects-header-section {
    width: 100%;
    margin: 0;
    min-height: 10vw;
    background-color: #233036;
    color:#a8dadc;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #projects-header h1{
    font-size: 8rem;
    padding: 3rem;
    margin: 0;
    text-align: center;
  }
  
 
  .project-category{
    display: flex;
    flex-direction: column;
    margin: 0;
    width: 100%;
    min-height: 30vw;
    background-color: #a8dadc;
  }

  .project-category h2{
    font-size: 6rem;
    padding: 3rem;
    padding-bottom: 0;
    margin: 0;
    text-align: center;
    color: #233036;
  }

  .project-category h4{
    font-size: 4rem;
    padding: 1rem;
    padding-bottom: 0;
    margin: 0;
    text-align: center;
    color: #233036;
  }

  .category-header{
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 1em;
    width: 100%;
    min-height: 2vw;
    background-color: #457b9d;
  }

  .category-header h4 {
    padding: 0.5em 1em;
  }

  .category-content {
    display: flex;
    justify-content:space-evenly;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    padding: 3em;
    background-color: #a8dadc;
  }

  .project-tile{
    width: 30rem;
    height: 20rem;
    margin: 3rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    box-shadow: 0.5rem 0.5rem 0.2rem #1d3577;
    background-color: #457b9d;
    background-size: cover;
  }
  
  .project-tile h3 {
    height: 50%;
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
    padding: 1rem;
    padding-bottom: 0.5rem;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    color: #233036; 
  }
  
  .project-tile p {
    height: 50%;
    margin: 0;
    font-size: 1.75rem;
    font-weight: bold;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    color: #233036;
  }
</style>