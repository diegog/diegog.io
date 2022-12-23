<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Navbar from '../lib/components/navbar.svelte';
	import Sketch from '../lib/components/sketch.svelte';
	import Bio from '../lib/components/bio.svelte';
	import Projects from '$lib/components/projects.svelte';
</script>

<div id="app">
	<Navbar />
	<Sketch />
	<br />
	<Bio />
	<br />
	<Projects />
	<br />
</div>

<style>
	:global(body) {
		background: #f4f4f4;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
		background: #f4f4f4;
		max-width: 100%;
		overflow-x: hidden;
	}
</style>
