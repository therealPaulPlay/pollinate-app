<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { Edit, Cloud, Sun, Mail, Bug, Languages, ChevronRight, Plus, CloudRain } from "lucide-svelte";
	import { onMount } from "svelte";
	import {
		pollenData,
		isLoading,
		userLocation,
		userPollen,
		fetchPollenData,
		calculateRiskLevel
	} from "$lib/utils/pollen-data.js";
	import { getRiskColor } from "$lib/utils/risk-color.js";
	import { formatDate } from "$lib/utils/format-date.js";
	import { AreaChart } from "layerchart";
	import { scaleLinear, scalePoint } from "d3-scale";
	import { curveNatural } from "d3-shape";
	import { goto } from "$app/navigation";
	import ForecastDrawer from "$lib/components/ForecastDrawer.svelte";
	import Widget from "$lib/components/Widget.svelte";
	import Minus from "@lucide/svelte/icons/minus";
	import { slide } from "svelte/transition";
	import { vibrate } from "$lib/utils/vibrate";

	let pollenTypesList = $state({});
	let forecastDrawerOpen = $state(false);
	let showingAllOthers = $state(false);

	// Basic derived values
	let riskLevel = $derived.by(() => calculateRiskLevel($pollenData, $userPollen));

	// User's selected pollen with levels
	let selectedPollenData = $derived.by(() => {
		return $userPollen
			.map((code) => {
				const plant = $pollenData?.dailyInfo?.[0]?.plantInfo?.find((p) => p.code === code);
				return {
					code,
					name: pollenTypesList[code]?.name || code,
					level: plant?.indexInfo?.value || 0
				};
			})
			.sort((a, b) => b.level - a.level);
	});

	// Other pollen types
	let otherPollenData = $derived.by(() => {
		const others = Object.keys(pollenTypesList)
			.filter((code) => !$userPollen.includes(code))
			.map((code) => {
				const plant = $pollenData?.dailyInfo?.[0]?.plantInfo?.find((p) => p.code === code);
				return {
					code,
					name: pollenTypesList[code]?.name || code,
					level: plant?.indexInfo?.value || 0
				};
			})
			.sort((a, b) => b.level - a.level);

		return showingAllOthers ? others : others.slice(0, 3);
	});

	// Forecast data for user's selected pollen
	let forecastData = $derived.by(() => {
		if (!$pollenData?.dailyInfo || $userPollen.length === 0) return [];

		return $pollenData.dailyInfo.slice(0, 4).map((day) => {
			const dayData = { date: formatDate(day.date).split(",")[0] };
			$userPollen.forEach((pollenCode) => {
				const plant = day.plantInfo?.find((p) => p.code === pollenCode);
				dayData[pollenCode] = plant?.indexInfo?.value || 0;
			});
			return dayData;
		});
	});

	// Chart config for user's pollen
	let chartConfig = $derived.by(() => {
		const config = {};
		const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
		$userPollen.forEach((pollenCode, index) => {
			config[pollenCode] = {
				label: pollenTypesList[pollenCode]?.name || pollenCode,
				color: colors[index % colors.length]
			};
		});
		return config;
	});

	onMount(async () => {
		try {
			const response = await fetch("/json/pollen-types.json");
			pollenTypesList = await response.json();
		} catch (error) {
			console.error("Failed to load pollen types:", error);
		}
		await fetchPollenData();
	});
</script>

<div class="max-h-screen space-y-6 overflow-y-auto p-6">
	<!-- Header -->
	<header class="flex w-full items-center gap-3">
		<h1 class="truncate font-bevellier text-5xl">
			{#if $isLoading}
				<div class="h-14 w-[50dvw] animate-pulse rounded-full bg-muted"></div>
			{:else}
				{$userLocation?.name?.split(",")[0] || "Location"}
			{/if}
		</h1>
		<Button
			size="icon"
			class="flex-shrink-0"
			onclick={() => {
				vibrate.light();
				goto("/select-location");
			}}
		>
			<Edit class="h-5 w-5" />
		</Button>
	</header>

	<!-- Widget Grid -->
	<div class="grid auto-rows-fr grid-cols-3 gap-4">
		<!-- Risk Level -->
		<Widget title="Risk" cellWidth={1} fixedHeight={true} bgColor={getRiskColor(riskLevel)} isLoading={$isLoading}>
			<span class="text-4xl font-bold {riskLevel > 0 ? 'text-white' : ''}">
				{riskLevel}<span class="ml-0.5 align-[2px] text-sm">/5</span>
			</span>
		</Widget>

		<!-- Forecast -->
		<Widget
			title="Forecast"
			cellWidth={2}
			fixedHeight={true}
			isLoading={$isLoading}
			onclick={() => {
				vibrate.medium();
				forecastDrawerOpen = true;
			}}
		>
			{#if forecastData.length > 0 && $userPollen.length > 0}
				<div class="-m-4 h-full w-full overflow-hidden">
					<Chart.Container config={chartConfig} class="h-full w-full">
						<AreaChart
							data={forecastData}
							x="date"
							xScale={scalePoint()}
							y={$userPollen}
							yScale={scaleLinear().domain([0, 5])}
							series={$userPollen.map((pollenCode, index) => ({
								key: pollenCode,
								label: pollenTypesList[pollenCode]?.name || pollenCode,
								color: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"][
									index % 5
								]
							}))}
							seriesLayout="stack"
							props={{
								area: {
									curve: curveNatural,
									"fill-opacity": 0.8
								},
								xAxis: false,
								yAxis: false,
								grid: false,
								tooltip: false
							}}
						/>
					</Chart.Container>
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center text-center text-xs text-muted-foreground">
					{$userPollen.length === 0 ? "Select pollen types" : "No data"}
				</div>
			{/if}
		</Widget>

		<!-- Ozone -->
		<Widget title="Ozone" cellWidth={1} fixedHeight={true} isLoading={$isLoading}>
			<div class="flex flex-col items-center">
				<p class="text-2xl font-bold">{$pollenData?.currentConditions?.ozone || 0}</p>
				<p class="text-xs text-muted-foreground mt-4">μg/m³</p>
			</div>
		</Widget>

		<!-- Thunderstorm -->
		<Widget title="Weather" cellWidth={1} fixedHeight={true} isLoading={$isLoading}>
			{#if $pollenData?.currentConditions?.generalWheather === "clear"}
				<Sun class="mx-auto h-8 w-8" />
			{:else if $pollenData?.currentConditions?.generalWheather === "rainy"}
				<CloudRain class="mx-auto h-8 w-8" />
			{:else if $pollenData?.currentConditions?.generalWheather === "cloudy"}
				<Cloud class="mx-auto h-8 w-8" />
			{:else}
				<Cloud class="mx-auto h-8 w-8" />
			{/if}
			<p class="text-xs text-muted-foreground mt-4">
				{$pollenData?.currentConditions?.generalWheather?.[0]?.toUpperCase() +
					$pollenData?.currentConditions?.generalWheather?.slice(1)}
			</p>
		</Widget>

		<!-- Air quality -->
		<Widget title="Air quality" cellWidth={1} fixedHeight={true} isLoading={$isLoading}>
			<div class="flex flex-col items-center">
				<p class="text-2xl font-bold">{$pollenData?.currentConditions?.airQuality || 0}</p>
				<p class="text-xs text-muted-foreground mt-4">AQI</p>
			</div>
		</Widget>
	</div>

	<!-- All pollen -->
	<!-- Pollen -->
	<Widget title="Pollen" fixedHeight={false} isLoading={$isLoading}>
		<div class="space-y-6">
			<!-- Selected Pollen (no header) -->
			{#if selectedPollenData.length > 0}
				<div class="space-y-2">
					{#each selectedPollenData as pollen}
						<div
							class="flex cursor-pointer items-center justify-between px-1 py-2 transition hover:opacity-50 active:scale-95"
						>
							<span class="text-sm font-medium">{pollen.name}</span>
							<div class="flex items-center gap-3">
								<div class="h-2 w-16 overflow-hidden rounded-full bg-secondary/35">
									<div
										class="h-full rounded-full transition-all duration-300"
										style="width: {(pollen.level / 5) * 100}%; background-color: {getRiskColor(pollen.level)}"
									></div>
								</div>
								<span class="w-8 text-xs font-medium text-muted-foreground">{pollen.level}/5</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Others Section with divider -->
			{#if otherPollenData.length > 0}
				<div class="space-y-3">
					<div class="mx-1 flex items-center gap-3">
						<h4 class="text-sm text-muted-foreground">Others</h4>
						<div class="mt-1 h-px flex-1 bg-border"></div>
					</div>
					<div class="space-y-2">
						{#each otherPollenData as pollen}
							<div
								transition:slide={{ duration: 250 }}
								class="flex cursor-pointer items-center justify-between px-1 py-2 opacity-60 transition hover:opacity-25 active:scale-95"
							>
								<span class="text-sm font-medium">{pollen.name}</span>
								<div class="flex items-center gap-3">
									<div class="h-2 w-16 overflow-hidden rounded-full bg-secondary/35">
										<div
											class="h-full rounded-full transition-all duration-300"
											style="width: {(pollen.level / 5) * 100}%; background-color: {getRiskColor(pollen.level)}"
										></div>
									</div>
									<span class="w-8 text-xs font-medium text-muted-foreground">{pollen.level}/5</span>
								</div>
							</div>
						{/each}

						{#if Object.keys(pollenTypesList).length - $userPollen.length > 3}
							<Button
								class="w-full"
								onclick={() => {
									vibrate.light();
									showingAllOthers = !showingAllOthers;
								}}
							>
								{showingAllOthers ? "Show less" : "Show all"}
								{#if showingAllOthers}
									<Minus />
								{:else}
									<Plus />
								{/if}
							</Button>
						{/if}
					</div>
				</div>
			{:else}
				<div class="py-6 text-center text-muted-foreground">
					<p class="text-sm">No pollen types selected.</p>
				</div>
			{/if}
		</div>
	</Widget>

	<!-- Pollen Actions -->
	<div class="flex justify-center">
		<Button
			variant="outline"
			onclick={() => {
				vibrate.light();
				goto("/select-pollen-types");
			}}
		>
			<Edit class="mr-2 h-4 w-4" />
			Edit pollen selection
		</Button>
	</div>

	<!-- More Section -->
	<div class="space-y-2">
		<h2 class="px-1 text-sm font-medium text-muted-foreground">More</h2>
		<div class="space-y-2">
			<Button variant="secondary" class="h-12 w-full justify-between">
				<div class="flex items-center gap-3">
					<Languages class="h-5 w-5" />
					<span>Language</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>

			<Button variant="secondary" class="h-12 w-full justify-between">
				<div class="flex items-center gap-3">
					<Mail class="h-5 w-5" />
					<span>Feedback</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>

			<Button variant="secondary" class="h-12 w-full justify-between">
				<div class="flex items-center gap-3">
					<Bug class="h-5 w-5" />
					<span>Report bug</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>

<!-- Forecast Drawer Component -->
<ForecastDrawer bind:open={forecastDrawerOpen} {forecastData} isLoading={$isLoading} />
