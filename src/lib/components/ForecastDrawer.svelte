<script>
	import * as Chart from "$lib/components/ui/chart/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { LineChart } from "layerchart";
	import { scaleLinear, scalePoint } from "d3-scale";
	import { getRiskColor } from "$lib/utils/risk-color.js";

	let { open = $bindable(), forecastData = [], isLoading = false } = $props();

	const chartConfig = {
		grass: { label: "Grass", color: "var(--chart-1)" },
		tree: { label: "Tree", color: "var(--chart-2)" },
		weed: { label: "Weed", color: "var(--chart-3)" }
	};
</script>

<Drawer.Root bind:open>
	<Drawer.Content class="max-h-[80vh]">
		<Drawer.Header>
			<Drawer.Title class="font-bevellier text-2xl">4-Day Forecast</Drawer.Title>
			<Drawer.Description>Detailed pollen forecast for your selected allergens</Drawer.Description>
		</Drawer.Header>

		<div class="space-y-6 p-6">
			{#if isLoading}
				<div class="h-64 animate-pulse rounded bg-muted"></div>
			{:else if forecastData.length > 0}
				<!-- Large Chart -->
				<div class="h-64">
					<Chart.Container config={chartConfig} class="h-full">
						<LineChart
							data={forecastData}
							x="date"
							xScale={scalePoint().padding(0.3)}
							y={["grass", "tree", "weed"]}
							yScale={scaleLinear().domain([0, 5])}
						>
							{#snippet chartTooltip()}
								<Chart.Tooltip />
							{/snippet}
						</LineChart>
					</Chart.Container>
				</div>

				<!-- Daily Breakdown -->
				<div class="space-y-3">
					<h3 class="font-medium">Daily Breakdown</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each forecastData as day}
							<div class="space-y-2 rounded-lg bg-muted p-3">
								<h4 class="text-sm font-medium">{day.date}</h4>
								<div class="space-y-1 text-xs">
									<div class="flex justify-between">
										<span>Grass:</span>
										<span class="font-medium" style="color: {getRiskColor(day.grass)}">{day.grass}/5</span>
									</div>
									<div class="flex justify-between">
										<span>Tree:</span>
										<span class="font-medium" style="color: {getRiskColor(day.tree)}">{day.tree}/5</span>
									</div>
									<div class="flex justify-between">
										<span>Weed:</span>
										<span class="font-medium" style="color: {getRiskColor(day.weed)}">{day.weed}/5</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="py-12 text-center text-muted-foreground">
					<p>No forecast data available</p>
				</div>
			{/if}
		</div>
	</Drawer.Content>
</Drawer.Root>
