<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import {
		Edit,
		Cloud,
		Mail,
		Bug,
		Languages,
		ChevronRight,
		Plus,
		CloudRain,
		CloudLightning,
		SunMedium
	} from "lucide-svelte";
	import { onMount } from "svelte";
	import {
		pollenData,
		isLoading,
		userLocation,
		userPollen,
		fetchPollenData,
		calculateRiskLevel,
		getPollenLevel
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
	import InfoDrawer from "$lib/components/InfoDrawer.svelte";
	import LanguageDrawer from "$lib/components/LanguageDrawer.svelte";
	import * as m from "$lib/paraglide/messages";
	import { getLocale } from "$lib/paraglide/runtime";

	// Pollen section
	let pollenTypesList = $state({});
	let showingAllOthers = $state(false);
	let selectedDay = $state(0);

	function getTodayDataStartOffset() {
		// Current UTC day
		const now = new Date();
		const currentUtcDay = now.getUTCDate();

		// Find today date in API data (it might NOT be the first entry, if the data is old!)
		const todayIndex = $pollenData?.dailyInfo?.findIndex((day) => {
			return day.date?.day === currentUtcDay;
		});

		return todayIndex >= 0 ? todayIndex : 0;
	}

	// Get day labels for tabs and chart
	function getDayLabel(dayIndex) {
		if (!$pollenData?.dailyInfo?.[dayIndex]) return "Err";

		const todayIndex = getTodayDataStartOffset();
		const offsetFromToday = dayIndex - todayIndex;
		if (offsetFromToday === 0) return m.today();

		// Start from current UTC time, then add offset, then show in user's timezone
		const localNow = new Date();
		const localIndexAdjusted = new Date();
		localIndexAdjusted.setDate(localNow.getDate() + offsetFromToday);
		const dayOfWeek = localIndexAdjusted.getDay();

		const dayTranslations = [m.sun, m.mon, m.tue, m.wed, m.thu, m.fri, m.sat];
		return dayTranslations[dayOfWeek]();
	}

	// Get weather string
	function getWeatherString(weather) {
		const weatherMap = {
			clear: m.clear(),
			rainy: m.rainy(),
			cloudy: m.cloudy(),
			stormy: m.stormy()
		};
		return weatherMap[weather] || weather;
	}

	// Basic derived values
	let riskLevel = $derived.by(() => {
		const todayIndex = getTodayDataStartOffset();
		const todayData = $pollenData?.dailyInfo?.[todayIndex] || $pollenData?.dailyInfo?.[0];
		return calculateRiskLevel(todayData, $userPollen);
	});

	// Risk index forecast data for bar chart
	let riskForecastData = $derived.by(() => {
		if (!$pollenData?.dailyInfo || $userPollen.length === 0) return [];

		const todayIndex = getTodayDataStartOffset();

		return $pollenData.dailyInfo.slice(todayIndex, todayIndex + 4).map((day, index) => {
			const dayRisk = calculateRiskLevel(day, $userPollen);
			return {
				day: getDayLabel(index + todayIndex),
				risk: Math.max(dayRisk, 0.3),
				color: getRiskColor(dayRisk)
			};
		});
	});

	// Get current day's pollen data
	let currentDayData = $derived.by(() => {
		if (!pollenTypesList || Object.keys(pollenTypesList).length === 0) return [];
		const index = selectedDay + getTodayDataStartOffset();

		const allPollen = Object.keys(pollenTypesList)
			.map((code) => {
				return {
					code,
					name: getPollenName(code),
					level: getPollenLevel($pollenData, index, code),
					isSelected: $userPollen.includes(code)
				};
			})
			.sort((a, b) => {
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

	// Info Drawer
	let infoDrawerOpen = $state(false);
	let infoDrawerTitle = $state("Title");
	let infoDrawerText = $state("Default text.");
	let infoDrawerImageSrc = $state();

	// Language Drawer
	let languageDrawerOpen = $state(false);

	let plantTextList;

	function showPlantInfo(name, code) {
		infoDrawerTitle = name;
		infoDrawerText = plantTextList?.[code]?.description;
		infoDrawerImageSrc = "/images/plants/" + code?.toLowerCase() + ".jpg";
		infoDrawerOpen = true;
	}

	function showInfo(title, text) {
		infoDrawerImageSrc = null;
		infoDrawerTitle = title;
		infoDrawerText = text;
		infoDrawerOpen = true;
	}

	onMount(async () => {
		try {
			const locale = getLocale();
			// Load pollen types and descriptions in current language
			[pollenTypesList, plantTextList] = await Promise.all([
				await fetch("/json/pollen-types.json").then((response) => response.json()),
				await fetch(`/json/pollen-descriptions-${locale}.json`).then((response) => response.json())
			]);
		} catch (error) {
			console.error("Failed to load pollen types:", error);
			showInfo(m.error(), `${m.error_loading_pollen()} ${error}`);
		}
		try {
			await fetchPollenData();
		} catch (error) {
			showInfo(m.error(), `${m.error_fetching_data()} ${error}`);
		}
	});

	// Get localized name for pollen type
	function getPollenName(code) {
		const locale = getLocale();
		const nameKey = `name-${locale}`;
		const pollenData = pollenTypesList[code];
		return pollenData?.[nameKey] || pollenData?.["name-en"] || code;
	}
</script>

<!-- Header -->
<header class="fixed top-0 z-10 flex w-full items-center gap-3 bg-background p-6 pt-[calc(1.5rem+var(--safe-top))]">
	<h1 class="truncate font-bevellier text-5xl">
		{#if $isLoading}
			<div class="h-12 w-[50dvw] animate-pulse rounded-xl bg-muted"></div>
		{:else}
			{$userLocation?.name?.split(",")[0] || m.location_placeholder()}
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

<div
	class="no-scrollbar of-top of-length-2 fixed top-[calc(5rem+var(--safe-top))] right-0 bottom-0 left-0 space-y-6 overflow-y-auto p-6 pb-12"
>
	<!-- Widget Grid -->
	<div class="grid auto-rows-fr grid-cols-3 gap-4">
		<!-- Risk Level -->
		<Widget
			title={m.risk()}
			cellWidth={1}
			fixedHeight={true}
			bgColor={getRiskColor(riskLevel)}
			isLoading={$isLoading}
			onclick={() => {
				vibrate.light();
				showInfo(m.risk(), m.risk_description());
			}}
		>
			<span class="font-bevellier text-4xl {riskLevel > 0 ? 'text-white' : ''}">
				{riskLevel}<span class="ml-0.5 align-[2px] text-sm">/5</span>
			</span>
		</Widget>

		<!-- Risk Forecast Bar Chart -->
		<Widget title={m.risk_forecast()} cellWidth={2} fixedHeight={true} isLoading={$isLoading}>
			{#if riskForecastData.length > 0}
				<div class="pointer-events-none h-full max-h-18 w-full overflow-hidden pt-0.25">
					<Chart.Container
						config={{
							risk: {
								label: m.risk(),
								color: "var(--chart-1)"
							}
						}}
						class="h-full w-full [&_.lc-group-g.lc-rule-g]:hidden [&_.lc-spline-path.lc-bar.lc-bars-bar]:stroke-none"
					>
						<BarChart
							data={riskForecastData}
							x="day"
							y="risk"
							axis="x"
							xScale={scaleBand().padding(0.25)}
							yScale={scaleLinear()}
							yDomain={[0, 5]}
							yNice={true}
						/>
					</Chart.Container>
				</div>
			{:else}
				<div class="flex h-full w-full items-center justify-center text-center text-xs text-muted-foreground">
					{$userPollen.length === 0 ? m.select_pollen_types() : m.no_data()}
				</div>
			{/if}
		</Widget>

		<!-- Ozone -->
		<Widget
			title={m.ozone()}
			cellWidth={1}
			fixedHeight={true}
			isLoading={$isLoading}
			onclick={() => {
				vibrate.light();
				showInfo(m.ozone(), m.ozone_description());
			}}
		>
			<div class="flex flex-col items-center">
				<p class="font-bevellier text-4xl">{$pollenData?.currentConditions?.ozone || 0}</p>
				<p class="mt-2 text-xs text-muted-foreground">μg/m³</p>
			</div>
		</Widget>

		<!-- Weather -->
		<Widget
			title={m.weather()}
			cellWidth={1}
			fixedHeight={true}
			isLoading={$isLoading}
			onclick={() => {
				vibrate.light();
				showInfo(m.weather(), m.weather_description());
			}}
		>
			{#if $pollenData?.currentConditions?.generalWheather === "clear"}
				<SunMedium class="mx-auto h-8 w-8" strokeWidth={4} />
			{:else if $pollenData?.currentConditions?.generalWheather === "rainy"}
				<CloudRain class="mx-auto h-8 w-8" strokeWidth={4} />
			{:else if $pollenData?.currentConditions?.generalWheather === "cloudy"}
				<Cloud class="mx-auto h-8 w-8" strokeWidth={4} />
			{:else}
				<CloudLightning class="mx-auto h-8 w-8" strokeWidth={4} />
			{/if}
			<p class="mt-4 text-xs text-muted-foreground">
				{getWeatherString($pollenData?.currentConditions?.generalWheather)}
			</p>
		</Widget>

		<!-- Air quality -->
		<Widget
			title={m.air_quality()}
			cellWidth={1}
			fixedHeight={true}
			isLoading={$isLoading}
			onclick={() => {
				vibrate.light();
				showInfo(m.air_quality(), m.air_quality_description());
			}}
		>
			<div class="flex flex-col items-center">
				<span class="font-bevellier text-4xl">
					{$pollenData?.currentConditions?.airQuality || 0}<span class="ml-0.5 align-[2px] text-sm">/6</span>
				</span>
				<p class="mt-2 text-xs text-muted-foreground">AQI</p>
			</div>
		</Widget>
	</div>

	<!-- Pollen Forecast Section with Day Tabs -->
	<Widget title={m.pollen()} fixedHeight={false} isLoading={$isLoading}>
		<div class="space-y-4">
			<!-- Day Selector Pills -->
			{#if $pollenData?.dailyInfo?.length > 0}
				{@const todayIndex = getTodayDataStartOffset()}
				<div class="of-left of-right no-scrollbar flex gap-2 overflow-x-auto pb-2">
					{#each $pollenData.dailyInfo.slice(todayIndex) as day, index}
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
							{getDayLabel(index + todayIndex)}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Selected Pollen for Current Day -->
			{#if selectedPollenData.length > 0}
				<div class="space-y-2">
					{#each selectedPollenData as pollen (pollen.name)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							animate:flip={{ duration: 250 }}
							role="button"
							tabindex={0}
							class="flex cursor-pointer items-center justify-between px-1 py-2 transition hover:opacity-50 active:scale-95"
							onclick={() => {
								showPlantInfo(pollen.name, pollen.code);
							}}
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
						<h4 class="text-sm text-muted-foreground">{m.others()}</h4>
						<div class="mt-1 h-px flex-1 bg-border"></div>
					</div>
					<div class="space-y-2">
						{#each otherPollenData as pollen (pollen.name)}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<div
								transition:slide={{ duration: 250 }}
								role="button"
								tabindex={0}
								class="flex cursor-pointer items-center justify-between px-1 py-2 opacity-60 transition hover:opacity-25 active:scale-95"
								onclick={() => {
									showPlantInfo(pollen.name, pollen.code);
								}}
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
								{showingAllOthers ? m.show_less() : m.show_all()}
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
					<p class="text-sm">{m.no_pollen_selected()}</p>
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
			{m.edit_pollen_selection()}
		</Button>
	</div>

	<!-- More Section -->
	<div class="space-y-2">
		<h2 class="px-1 text-sm font-medium text-muted-foreground">{m.more()}</h2>
		<div class="space-y-4">
			<Button
				variant="secondary"
				class="h-12 w-full justify-between"
				onclick={() => {
					vibrate.light();
					languageDrawerOpen = true;
				}}
			>
				<div class="flex items-center gap-3">
					<Languages class="h-5 w-5" />
					<span>{m.language()}</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>

			<Button
				variant="secondary"
				class="h-12 w-full justify-between"
				onclick={() => {
					vibrate.light();
					window.open("mailto:paulplaystudio@gmail.com?subject=Pollinate%20feedback");
				}}
			>
				<div class="flex items-center gap-3">
					<Mail class="h-5 w-5" />
					<span>{m.feedback()}</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>

			<Button
				variant="secondary"
				class="h-12 w-full justify-between"
				onclick={() => {
					vibrate.light();
					window.open("https://bugspot.dev/form/a05fe6d4-b568-4157-a6db-aadfd0ecd886");
				}}
			>
				<div class="flex items-center gap-3">
					<Bug class="h-5 w-5" />
					<span>{m.report_bug()}</span>
				</div>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>

<InfoDrawer bind:open={infoDrawerOpen} text={infoDrawerText} title={infoDrawerTitle} imageSrc={infoDrawerImageSrc} />
<LanguageDrawer bind:open={languageDrawerOpen} />
