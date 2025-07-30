<script>
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { Home } from "lucide-svelte";
	import * as m from "$lib/paraglide/messages";
</script>

<div class="flex h-full flex-col items-center justify-center gap-4 text-center">
	<h1 class="font-bevellier text-7xl">{page.status}</h1>
	<p class="max-w-70">{m.error()}: <i>{page.error.message}</i>. {m.thankfully_not_allergic()}</p>
	<Button
		class="fixed bottom-12"
		href="/"
		size="lg"
		onclick={() => {
			vibrate.light();
		}}><Home /> {m.go_home()}</Button
	>
</div>
