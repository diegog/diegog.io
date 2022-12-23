<script>
	import { onMount } from 'svelte';

	onMount(() => {
		let p5 = document.createElement('script');
		let sketch = document.createElement('script');
		p5.setAttribute('src', '/p5.min.js');
		sketch.setAttribute('src', '/sketch.js');
		document.head.append(p5);
		document.body.appendChild(sketch);
	});
</script>

<div id="sketch" style="width: 100vw; height:60vh;" />

<style>
	#sketch {
		position: relative;
	}
</style>
