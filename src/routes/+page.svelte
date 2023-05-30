<script>
	import Sketch from '../lib/components/sketch.svelte';
	import Bio from '../lib/components/bio.svelte';
	import Projects from '../lib/components/projects.svelte';
</script>

<div id="app">
	<Sketch />
	<br />
	<Bio />
	<br />
	<Projects />
	<br />
</div>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		max-width: 100%;
		overflow-x: hidden;
	}
</style>
