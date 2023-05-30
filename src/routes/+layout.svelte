<script>
	import Navbar from '../lib/components/navbar.svelte';
</script>

<Navbar />

<slot />

<style>
	:global(body) {
		background: #f4f4f4;
	}
</style>
