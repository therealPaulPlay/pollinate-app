<script>
	import { onMount, onDestroy } from "svelte";
	import { goto, onNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { ModeWatcher } from "mode-watcher";
	import { locales, localizeHref } from "$lib/paraglide/runtime";
	import { initializeAndroidBackHandler, removeAndroidBackHandler } from "$lib/utils/android-back.js";
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
		initializeAndroidBackHandler(); // Initialize Android back button handler
	});

	onDestroy(() => {
		removeAndroidBackHandler(); // Clean up listener
	});
</script>

<svelte:head>
	<title>Pollinate</title>
</svelte:head>

<main class="fixed inset-0 min-h-dvh overscroll-none select-none">
	{@render children()}
</main>

<!-- Required for SSG - generates all language pages during build -->
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<ModeWatcher />
