<script>
	import * as Drawer from "$lib/components/ui/drawer/index.js";

	let { open = $bindable(), title = "Info", text = "Default text." } = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[50dvh]">
		<Drawer.Header>
			<Drawer.Title class="font-bevellier text-2xl">{title}</Drawer.Title>
		</Drawer.Header>
		<div>
			<p>
				{text}
			</p>
		</div>
	</Drawer.Content>
</Drawer.Root>
