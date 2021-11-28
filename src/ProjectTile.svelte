<script lang="ts">
    export let project;

    const id:string=project.id;
    const link:string=project.link;
    const title:string = project.title;
    const text:string = project.text;
    const tools:string = project.tools;
    const background:string = project.background;

</script>

<a id={id} 
    class="project-tile" 
    target="_blank" 
    href={link}
    style="background-image: url('{background}')">
    <h3>{title}</h3>
    <p>{text}</p>
</a>


<style>
  
  a{
    width: 30rem;
    height: 20rem;
    margin: 3rem;
    border-radius: 1rem; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    /*box-shadow: 0.5rem 0.5rem 0.2rem #1d3577; */
    /*background-color: #457b9d; */
    background-color: white; 
    background-size: cover; 
  }

    h3 {
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
  
  p {
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