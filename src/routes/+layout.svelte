<script>
	import { onMount } from "svelte";
	import { goto, onNavigate } from "$app/navigation";
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
		if (localStorage.getItem("onboardingCompleted") === null) goto("/onboarding"); // Go to onboarding if not yet completed
	});
</script>

<svelte:head>
	<title>Pollinate</title>
</svelte:head>

<main class="fixed inset-0 min-h-screen touch-none overscroll-none select-none">
	{@render children()}
</main>