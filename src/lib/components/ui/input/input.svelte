<script>
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	} = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			"selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-16 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			"bg-muted selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-12 w-full min-w-0 rounded-md px-4 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}