<script>
	export const prerender = true;
	import { onMount } from "svelte";
	import { goto, onNavigate } from "$app/navigation";
	import { locales, localizeHref } from "../paraglide/runtime";
	import { page } from "$app/state";
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

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
