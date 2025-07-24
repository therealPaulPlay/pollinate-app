<script>
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { Home } from "lucide-svelte";
</script>

<div class="flex h-full flex-col items-center justify-center gap-4 text-center">
	<h1 class="font-bevellier text-7xl">{page.status}</h1>
	<p class="max-w-70">Error: <i>{page.error.message}</i>. Thankfully, we're not allergic to errors.</p>
	<Button
		class="fixed bottom-12"
		href="/"
		size="lg"
		onclick={() => {
			vibrate.light();
		}}><Home /> Go home</Button
	>
</div>
