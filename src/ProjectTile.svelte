<script lang="ts">
    export let project;

    const id:string=project.id;
    const link:string=project.link;
    const title:string = project.title;
    const text:string = project.text;
    const tools:string = project.tools;
    const image:string = project.image;

</script>

<a id={id} 
    class="project-tile" 
    target="_blank" 
    href={link}
    >
    <img src={image} alt="A logo related to the project">
    <h3>{title}</h3>
</a>


<style>
  
  a{
    width: 30rem;
    height: 30rem;
    margin: 3rem;
    /*border-radius: 1rem;  */
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    /*box-shadow: 0.5rem 0.5rem 0.2rem #1d3577; */
    /*background-color: #457b9d; */
  }

  img {
      width: 100%;
      height: 75%;
      background-color: white;
  }

  h3 {
    width: 100%;
    height: 25%;
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
    padding: 1rem;
    padding-bottom: 0.5rem;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    color: white; 
    background-color: var(--color-1);
    text-decoration: none;
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