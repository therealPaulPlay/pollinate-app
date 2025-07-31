<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { SvelteSet } from "svelte/reactivity";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { Check, Wheat, TreeDeciduous } from "lucide-svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";
	import * as m from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";

	let pollenTypes = $state({});
	let selectedPollen = new SvelteSet();
	let isLoading = $state(true);

	onMount(async () => {
		try {
			// Load pollen types with all language names
			const response = await fetch("/json/pollen-types.json");
			pollenTypes = await response.json();
		} catch (error) {
			console.error("Failed to load pollen types:", error);
		} finally {
			isLoading = false;
		}

		const saved = localStorage.getItem("userPollen");
		if (saved) {
			selectedPollen.clear();
			const parsedSave = JSON.parse(saved);
			parsedSave.forEach((item) => {
				selectedPollen.add(item);
			});
		}
	});

	function togglePollen(pollenId) {
		if (selectedPollen.has(pollenId)) selectedPollen.delete(pollenId);
		else selectedPollen.add(pollenId);
		vibrate.light();
	}

	function savePollen() {
		localStorage.setItem("userPollen", JSON.stringify([...$state.snapshot(selectedPollen)]));
		console.log("Pollen type saved:", [...selectedPollen]);
	}

	// Get localized name for pollen type
	function getPollenName(data) {
		const locale = getLocale();
		const nameKey = `name-${locale}`;
		return data[nameKey] || data["name-en"] || "Unknown";
	}
</script>

<div class="flex h-full flex-col items-center">
	<div class="mt-[calc(2rem+var(--safe-top))] flex w-full max-w-80 flex-col space-y-8 overflow-hidden">
		<p class="text-center font-bevellier text-5xl">{m.what_allergies()}</p>

		{#if isLoading}
			<div class="flex justify-center py-12">
				<div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
			</div>
		{:else}
			<div transition:fade class="no-scrollbar of-top of-bottom of-length-2 mb-8 flex-grow space-y-2 overflow-y-auto">
				{#each Object.entries(pollenTypes) as [id, data]}
					<label class="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-xl p-4">
						<Checkbox checked={selectedPollen.has(id)} onCheckedChange={() => togglePollen(id)} />
						{#if data.category === "tree"}
							<TreeDeciduous class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
						{:else if data.category === "grass"}
							<Wheat class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
						{:else}
							<Wheat class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
						{/if}
						<span class="text-base">{getPollenName(data)}</span>
					</label>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-auto mb-12">
		<Button
			size="lg"
			onclick={() => {
				savePollen();
				vibrate.light();
				if (localStorage.getItem("onboardingCompleted")) goto("/");
				else goto("/select-location");
			}}
			disabled={selectedPollen.size === 0}
		>
			{m.save_allergies()}
			<Check class="mt-0.5" />
		</Button>
	</div>
</div>
