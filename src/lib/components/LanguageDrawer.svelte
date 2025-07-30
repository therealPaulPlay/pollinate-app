<script>
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Check } from "lucide-svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { vibrate } from "$lib/utils/vibrate";
	import { getLocale, setLocale, locales } from "$lib/paraglide/runtime";
	import { m } from "$lib/paraglide/messages";

	let { open = $bindable(false) } = $props();

	const languageNames = {
		en: "English",
		de: "Deutsch",
		es: "Español",
		it: "Italiano",
		fr: "Français",
		pt: "Português",
		da: "Dansk",
		nl: "Nederlands",
		sv: "Svenska",
		hu: "Magyar",
		ja: "日本語",
		uk: "Українська"
	};

	function switchLanguage(newLang) {
		setLocale(newLang);
		vibrate.light();
		open = false;
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[50dvh]">
		<Drawer.Header>
			<Drawer.Title class="font-bevellier text-3xl">{m.language()}</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-73 of-top of-bottom space-y-2 overflow-y-auto px-4 mb-8">
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