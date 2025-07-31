<script>
	import * as Drawer from "$lib/components/ui/drawer/index.js";

	let { open = $bindable(false), title = "Info", text = "Default text.", imageSrc } = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[50dvh]">
		<Drawer.Header>
			<Drawer.Title class="font-bevellier text-3xl">{title}</Drawer.Title>
		</Drawer.Header>
		<div class="px-4 mb-12 overflow-y-auto of-top of-bottom of-length-2 no-scrollbar">
			{#if imageSrc}
				<img alt="plant" class="h-40  w-full rounded-md object-cover mb-4 dark:brightness-85" src={imageSrc} />
			{/if}
			<p>{text}</p>
		</div>
	</Drawer.Content>
</Drawer.Root>
