<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Check, MapPin, Search, Clock } from "lucide-svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { fade, slide } from "svelte/transition";
	import { onMount, onDestroy } from "svelte";
	import maplibregl from "maplibre-gl";
	import { goto } from "$app/navigation";
	import * as m from "$lib/paraglide/messages";

	let searchQuery = $state("");
	let locations = $state([]);
	let recentLocations = $state([]);
	let selectedLocation = $state(null);
	let isLoading = $state(false);
	let showDropdown = $state(false);
	let searchTimeout;
	let mapContainer;
	let mapLoaded = $state(false);
	let map;

	async function searchLocations(query) {
		if (query.length < 3) return (locations = []); // Ignore super short searches
		isLoading = true;

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}&addressdetails=1`
			);
			const data = await response.json();

			locations = data.map((item) => ({
				name: formatLocationName(item.address),
				lat: parseFloat(item.lat),
				lon: parseFloat(item.lon)
			}));

			// Remove duplicates
			const uniqueNames = new Set();
			locations = locations.filter((item) => {
				if (item.name && uniqueNames.has(item.name)) return false;
				uniqueNames.add(item.name);
				return true;
			});

			// Auto-focus map on first result
			if (locations.length > 0 && map) {
				const firstLocation = locations[0];
				map.flyTo({
					center: [firstLocation.lon, firstLocation.lat],
					zoom: 6,
					duration: 1500
				});
			}
		} catch (error) {
			console.error("Search failed:", error);
			locations = [];
		}

		isLoading = false;
	}

	function formatLocationName(address) {
		const parts = [];
		if (address?.city || address?.town || address?.village) parts.push(address.city || address.town || address.village);
		if (address?.state) parts.push(address.state);
		if (address?.country) parts.push(address.country);
		return parts.join(", ");
	}

	function handleInput(e) {
		searchQuery = e.target.value;
		clearTimeout(searchTimeout);

		if (searchQuery.length === 0) {
			locations = [];
			showDropdown = recentLocations.length > 0;
		} else {
			showDropdown = true;
			searchTimeout = setTimeout(() => searchLocations(searchQuery), 300);
		}
	}

	function selectLocation(location) {
		selectedLocation = location;
		searchQuery = location.name;
		locations = [];
		showDropdown = false;

		// Zoom map to selected location
		if (map && location.lat && location.lon) {
			map.flyTo({
				center: [location.lon, location.lat],
				zoom: 8,
				duration: 2000
			});
		}

		vibrate.light();
	}

	function addToRecents(location) {
		recentLocations = recentLocations.filter((recent) => recent.name !== location.name); // Remove if already exists to avoid duplicates
		recentLocations = [location, ...recentLocations];
		if (recentLocations.length > 5) recentLocations = recentLocations.slice(0, 5); // Limit to 5
		localStorage.setItem("userLocationHistory", JSON.stringify(recentLocations));
	}

	function loadRecents() {
		const saved = localStorage.getItem("userLocationHistory");
		if (saved) recentLocations = JSON.parse(saved);
	}

	function saveLocation() {
		if (!selectedLocation) return;
		const location = $state.snapshot(selectedLocation);

		localStorage.setItem(
			"userLocation",
			JSON.stringify({
				name: location.name,
				lat: location.lat,
				lon: location.lon,
				timestamp: Date.now()
			})
		);
		console.log("Location saved:", location);
		addToRecents(location); // Add to recent locations only when saved
	}

	onMount(() => {
		loadRecents();

		if (!mapContainer) return;

		map = new maplibregl.Map({
			container: mapContainer,
			style: "https://tiles.openfreemap.org/styles/liberty",
			center: [-40, 40], // Show world view initially
			zoom: 1.5,
			interactive: false, // Disable interactions for background effect
			attributionControl: false
		});

		map.on("load", () => (mapLoaded = true));
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<svelte:head>
	<link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
</svelte:head>

<div class="relative z-10 flex h-full flex-col items-center">
	<!-- Background Map -->
	<div
		style:opacity={mapLoaded ? "0.2" : "0"}
		class="absolute top-55 right-0 bottom-30 left-0 mask-t-from-85% mask-r-from-70% mask-b-from-85% mask-l-from-70% sepia transition duration-1000"
	>
		<div bind:this={mapContainer} class="pointer-events-none h-full"></div>
	</div>
	<div class="mt-8 w-full max-w-md space-y-8">
		<p class="text-center font-bevellier text-5xl">{m.location_please()}</p>

		<div class="relative mx-auto max-w-80">
			<!-- Search box -->
			<search class="relative mb-4">
				<Search class="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder={m.search_city()}
					bind:value={searchQuery}
					oninput={handleInput}
					onfocus={() => (showDropdown = searchQuery.length === 0 ? recentLocations.length > 0 : locations.length > 0)}
					onblur={() => setTimeout(() => (showDropdown = false), 150)}
					class="pl-10 text-base"
				/>
				{#if isLoading}
					<div class="absolute top-1/2 right-3 -translate-y-1/2">
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
					</div>
				{/if}
			</search>

			<!-- Dropdown -->
			{#if showDropdown}
				<div class="z-50 overflow-hidden rounded-md bg-muted" transition:slide>
					<div class="of-top of-bottom of-length-2 no-scrollbar max-h-[calc(50dvh-200px)] overflow-y-auto">
						<!-- Show search results when there's a query -->
						{#if searchQuery.length > 0 && locations.length > 0}
							{#each locations as location}
								<button
									transition:slide={{ duration: 250 }}
									class="flex w-full max-w-full items-center gap-3 rounded-lg px-4 py-4 text-left transition ease-out hover:opacity-50 active:scale-95"
									onclick={() => selectLocation(location)}
								>
									<MapPin class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
									<span class="truncate text-base">{location.name}</span>
								</button>
							{/each}
						{/if}

						<!-- Show recents when no query -->
						{#if searchQuery.length === 0 && recentLocations.length > 0}
							{#each recentLocations as location}
								<button
									transition:slide={{ duration: 250 }}
									class="flex w-full max-w-full items-center gap-3 rounded-lg px-4 py-4 text-left transition ease-out hover:opacity-50 active:scale-95"
									onclick={() => selectLocation(location)}
								>
									<Clock class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
									<span class="truncate text-base">{location.name}</span>
								</button>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-auto mb-8">
		<Button
			size="lg"
			onclick={() => {
				saveLocation();
				localStorage.setItem("onboardingCompleted", true);
				vibrate.light();
				goto("/");
			}}
			disabled={!selectedLocation}
		>
			{m.save_location()}
			<Check class="mt-0.5" />
		</Button>
	</div>
</div>
