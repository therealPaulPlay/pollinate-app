<script>
	import { fade } from "svelte/transition";

	let {
		title,
		cellWidth = 1,
		fixedHeight = true,
		clickable = false,
		onclick,
		bgColor = null,
		isLoading = $bindable(false),
		children
	} = $props();
</script>

<div
	in:fade
	class="flex {fixedHeight ? 'h-full' : ''} flex-col gap-2 {cellWidth === 1
		? 'col-span-1'
		: cellWidth === 2
			? 'col-span-2'
			: 'col-span-3'}"
>
	<h3 class="truncate px-1 pt-2 text-sm font-medium text-nowrap text-muted-foreground">{title}</h3>
	<div
		class="flex grow flex-col justify-center overflow-hidden rounded-xl p-4 text-center transition ease-out {isLoading
			? 'animate-pulse'
			: ''} bg-card {onclick ? 'active:scale-95' : ''}"
		style={bgColor ? `background-color: ${bgColor}` : ""}
		{onclick}
		role={clickable ? "button" : undefined}
	>
		{#if !isLoading}
			{@render children()}
		{:else if cellWidth === 1}
			<div class="aspect-square"></div>
		{/if}
	</div>
</div>
