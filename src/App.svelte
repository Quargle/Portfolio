<script lang="ts">
	import Navbar from "./Navbar.svelte";
	import About from "./About.svelte";
	import Projects from "./Projects.svelte";
	import Contact from "./Contact.svelte";
</script>

<!-- Import Bootstrap CDN in page head-->
<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</svelte:head>

<!-- markup -->
<main>
	<Navbar />
	<About />
	<Projects />
	<Contact />
</main>

<style>
	/* Set global color variables so color scheme can be used throughout */
	:global(:root){
   		--color-1: #233036;
	}

	main {
		margin: 0;
		background-color: #457b9d;
	}
</style>

