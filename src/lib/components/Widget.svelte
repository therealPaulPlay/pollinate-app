<script>
	let {
		title,
		cellWidth = 1,
		fixedHeight = true,
		clickable = false,
		onclick = () => {},
		bgColor = null,
		children
	} = $props();
</script>

<div class="space-y-2 {cellWidth === 1 ? 'col-span-1' : cellWidth === 2 ? 'col-span-2' : 'col-span-3'}">
	<h3 class="px-1 text-sm font-medium text-muted-foreground">{title}</h3>
	<div
		class="rounded-xl p-4 {fixedHeight ? (cellWidth === 1 ? 'aspect-square' : 'h-24') : ''} {fixedHeight
			? 'flex flex-col justify-center text-center'
			: ''} {clickable ? 'cursor-pointer' : ''} {bgColor ? '' : 'bg-card'}"
		style={bgColor ? `background-color: ${bgColor}` : ""}
		onclick={clickable ? onclick : undefined}
		role={clickable ? "button" : undefined}
	>
		{@render children()}
	</div>
</div>
