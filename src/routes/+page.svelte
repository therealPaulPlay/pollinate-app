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
	import { BarChart } from "layerchart";
	import { scaleLinear, scaleBand } from "d3-scale";
	import { goto } from "$app/navigation";
	import Widget from "$lib/components/Widget.svelte";
	import Minus from "@lucide/svelte/icons/minus";
	import { slide } from "svelte/transition";
	import { vibrate } from "$lib/utils/vibrate";
	import { flip } from "svelte/animate";

	let pollenTypesList = $state({});
	let showingAllOthers = $state(false);
	let selectedDay = $state(0); // 0 = today, 1 = tomorrow, etc.

	// Basic derived values
	let riskLevel = $derived.by(() => calculateRiskLevel($pollenData, $userPollen));

	// Risk index forecast data for bar chart
	let riskForecastData = $derived.by(() => {
		if (!$pollenData?.dailyInfo || $userPollen.length === 0) return [];

		return $pollenData.dailyInfo.slice(0, 4).map((day, index) => {
			const dayRisk = calculateRiskLevel({ dailyInfo: [day] }, $userPollen);
			return {
				day: getDayLabel(index),
				risk: dayRisk,
				color: getRiskColor(dayRisk)
			};
		});
	});

	// Chart config for risk forecast
	const riskChartConfig = {
		risk: {
			label: "Risk Level",
			color: "var(--chart-1)"
		}
	};

	// Get day labels for tabs and chart
	function getDayLabel(dayIndex) {
		if (!$pollenData?.dailyInfo?.[dayIndex]) return "";
		const day = $pollenData.dailyInfo[dayIndex];
		const date = new Date(day.date.year, day.date.month - 1, day.date.day);
		return dayIndex === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
	}

	// Get current day's pollen data
	let currentDayData = $derived.by(() => {
		if (!$pollenData?.dailyInfo?.[selectedDay]) return [];

		const dayInfo = $pollenData.dailyInfo[selectedDay];
		const allPollen = Object.keys(pollenTypesList)
			.map((code) => {
				const plant = dayInfo.plantInfo?.find((p) => p.code === code);
				return {
					code,
					name: pollenTypesList[code]?.name || code,
					level: plant?.indexInfo?.value || 0,
					isSelected: $userPollen.includes(code)
				};
			})
			.sort((a, b) => {
				// Selected pollen first, then by level descending
				if (a.isSelected && !b.isSelected) return -1;
				if (!a.isSelected && b.isSelected) return 1;
				return b.level - a.level;
			});

		return allPollen;
	});

	// Selected and other pollen for current day
	let selectedPollenData = $derived(currentDayData.filter((p) => p.isSelected));
	let otherPollenData = $derived.by(() => {
		const others = currentDayData.filter((p) => !p.isSelected);
		return showingAllOthers ? others : others.slice(0, 3);
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
				<div class="h-12 w-[50dvw] animate-pulse rounded-xl bg-muted"></div>
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
			<span class="font-bevellier text-4xl {riskLevel > 0 ? 'text-white' : ''}">
				{riskLevel}<span class="ml-0.5 align-[2px] text-sm">/5</span>
			</span>
		</Widget>

		<!-- Risk Forecast Bar Chart -->
		<Widget title="Forecast" cellWidth={2} fixedHeight={true} isLoading={$isLoading}>
			{#if riskForecastData.length > 0 && $userPollen.length > 0}
				<div class="h-full w-full max-h-18 overflow-hidden pt-0.25 pointer-events-none">
					<Chart.Container config={riskChartConfig} class="h-full w-full">
						<BarChart
							data={riskForecastData}
							x="day"
							y="risk"
							axis="x"
							xScale={scaleBand().padding(0.25)}
							yScale={scaleLinear().domain([0, 5])}
                            yNice={false}
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
				<p class="font-bevellier text-4xl">{$pollenData?.currentConditions?.ozone || 0}</p>
				<p class="mt-2 text-xs text-muted-foreground">μg/m³</p>
			</div>
		</Widget>

		<!-- Weather -->
		<Widget title="Weather" cellWidth={1} fixedHeight={true} isLoading={$isLoading}>
			{#if $pollenData?.currentConditions?.generalWheather === "clear"}
				<Sun class="mx-auto h-8 w-8" strokeWidth={3} />
			{:else if $pollenData?.currentConditions?.generalWheather === "rainy"}
				<CloudRain class="mx-auto h-8 w-8" strokeWidth={3} />
			{:else if $pollenData?.currentConditions?.generalWheather === "cloudy"}
				<Cloud class="mx-auto h-8 w-8" strokeWidth={3} />
			{:else}
				<Cloud class="mx-auto h-8 w-8" strokeWidth={3} />
			{/if}
			<p class="mt-4 text-xs text-muted-foreground">
				{$pollenData?.currentConditions?.generalWheather?.[0]?.toUpperCase() +
					$pollenData?.currentConditions?.generalWheather?.slice(1)}
			</p>
		</Widget>

		<!-- Air quality -->
		<Widget title="Air quality" cellWidth={1} fixedHeight={true} isLoading={$isLoading}>
			<div class="flex flex-col items-center">
				<p class="font-bevellier text-4xl">{$pollenData?.currentConditions?.airQuality || 0}</p>
				<p class="mt-2 text-xs text-muted-foreground">AQI</p>
			</div>
		</Widget>
	</div>

	<!-- Pollen Forecast Section with Day Tabs -->
	<Widget title="Pollen" fixedHeight={false} isLoading={$isLoading}>
		<div class="space-y-4">
			<!-- Day Selector Pills -->
			{#if $pollenData?.dailyInfo?.length > 0}
				<div class="of-left of-right no-scrollbar flex gap-2 overflow-x-auto pb-2">
					{#each $pollenData.dailyInfo.slice(0, 4) as day, index}
						<button
							class="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ease-out active:scale-95 {selectedDay ===
							index
								? 'bg-primary text-primary-foreground'
								: 'bg-muted text-muted-foreground'}"
							onclick={() => {
								selectedDay = index;
								vibrate.light();
							}}
						>
							{getDayLabel(index)}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Selected Pollen for Current Day -->
			{#if selectedPollenData.length > 0}
				<div class="space-y-2">
					{#each selectedPollenData as pollen (pollen.name)}
						<div
							animate:flip={{ duration: 250 }}
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

			<!-- Others Section for Current Day -->
			{#if otherPollenData.length > 0}
				<div class="space-y-3">
					<div class="mx-1 flex items-center gap-3">
						<h4 class="text-sm text-muted-foreground">Others</h4>
						<div class="mt-1 h-px flex-1 bg-border"></div>
					</div>
					<div class="space-y-2">
						{#each otherPollenData as pollen (pollen.name)}
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

						{#if currentDayData.filter((p) => !p.isSelected).length > 3}
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
			{:else if selectedPollenData.length === 0}
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
