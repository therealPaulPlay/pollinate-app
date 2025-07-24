<script>
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Home } from "lucide-svelte";
</script>

<div class="flex h-full flex-col items-center justify-center gap-4 text-center">
	<h1 class="text-7xl font-bevellier">{page.status}</h1>
	<p class="max-w-80">Error "{page.error.message}" occured. Thankfully, we're not allergic to errors.</p>
    <Button class="fixed bottom-10" href="/"><Home /> Go home</Button>
</div>
