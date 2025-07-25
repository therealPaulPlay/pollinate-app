<script>
	import { onMount } from "svelte";
	import { onNavigate } from "$app/navigation";
	import "../app.css";
	import init from "overfade";

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(() => {
		init(); // Init overfade
	});
</script>

<main class="fixed inset-0 min-h-screen touch-none overscroll-none p-4 select-none">
	{@render children()}
</main>
