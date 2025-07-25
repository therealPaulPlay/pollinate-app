<script>
	import { onMount } from "svelte";
	import "../app.css";
	import init from "overfade";

	let { children } = $props();

	onMount(() => {
		init(); // Init overfade
	});
</script>

<main class="fixed inset-0 min-h-screen touch-none overscroll-none p-4 select-none">
	{@render children()}
</main>
