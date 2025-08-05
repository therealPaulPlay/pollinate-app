<script>
	import { fade, scale, slide } from "svelte/transition";
	import Button from "./ui/button/button.svelte";
	import { X } from "lucide-svelte";

	let {
		title,
		text = "This is the default text.",
		clickable = false,
		onclick,
		onclose,
		isLoading = $bindable(false)
	} = $props();
</script>

<div
	transition:slide
	class="row-span-0.25 relative col-span-3 flex grow flex-col space-y-1 overflow-hidden rounded-xl border-2 p-4 px-6 transition ease-out {isLoading
		? 'animate-pulse'
		: ''} bg-card {onclick ? 'active:scale-95' : ''}"
	{onclick}
	role={clickable ? "button" : undefined}
>
	<Button
		class="absolute top-2 right-2"
		size="sm"
		variant="ghost"
		onclick={() => {
			onclose?.();
		}}
	>
		<X />
	</Button>
	<h2 class="truncate font-bevellier text-2xl max-w-3/4" transition:fade={{ duration: 50 }}>
		{title}
	</h2>
	<p class="text-sm" transition:fade={{ duration: 50 }}>{text}</p>
</div>
