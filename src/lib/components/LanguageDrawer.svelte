<script>
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Check } from "lucide-svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { vibrate } from "$lib/utils/vibrate";
	import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";

	let { open = $bindable(false) } = $props();

	const languageNames = { en: "English", de: "Deutsch" };

	function switchLanguage(newLang) {
		setLocale(newLang);
		vibrate.light();
		open = false;
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[50dvh]">
		<Drawer.Header>
			<Drawer.Title class="font-bevellier text-3xl">Language</Drawer.Title>
		</Drawer.Header>
		<div class="space-y-2 px-4 pb-8 max-h-60 overflow-y-auto">
			{#each locales as lang}
				{@const isSelected = getLocale() === lang}
				<button
					class="flex w-full items-center justify-between rounded-lg p-4 text-left transition ease-out hover:opacity-50 active:scale-95 {isSelected
						? 'bg-primary/10'
						: ''}"
					onclick={() => switchLanguage(lang)}
				>
					<span class="text-base font-medium">{languageNames[lang] || lang}</span>
					{#if isSelected}
						<Check class="h-5 w-5 text-primary" />
					{/if}
				</button>
			{/each}
		</div>
	</Drawer.Content>
</Drawer.Root>
