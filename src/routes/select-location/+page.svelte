<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Check, MapPin, Search } from "lucide-svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { fade, slide } from "svelte/transition";

	let searchQuery = "";
	let locations = [];
	let selectedLocation = null;
	let isLoading = false;
	let searchTimeout;

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

			const uniqueNames = new Set();

			locations = locations.filter((item) => {
				if (item.name && uniqueNames.has(item.name)) return false;
				uniqueNames.add(item.name);
				return true;
			});
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
		searchTimeout = setTimeout(() => searchLocations(searchQuery), 300);
	}

	function selectLocation(location) {
		selectedLocation = location;
		searchQuery = location.name;
		locations = [];
		vibrate.light();
	}

	function saveLocation() {
		if (!selectedLocation) return;

		localStorage.setItem(
			"userLocation",
			JSON.stringify({
				name: selectedLocation.name,
				lat: selectedLocation.lat,
				lon: selectedLocation.lon,
				timestamp: Date.now()
			})
		);

		vibrate.light();
		console.log("Location saved:", selectedLocation);
	}
</script>

<div class="flex h-full flex-col items-center px-6">
	<div class="mt-30 w-full max-w-md space-y-8">
		<p class="text-center font-bevellier text-5xl">Location, please.</p>

		<div class="relative mx-auto max-w-80">
			<div class="relative">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search for your city"
					bind:value={searchQuery}
					oninput={handleInput}
					class="pl-10 text-base"
				/>
				{#if isLoading}
					<div class="absolute top-1/2 right-3 -translate-y-1/2">
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
					</div>
				{/if}
			</div>

			{#if locations.length > 0}
				<p class="mt-5 ml-4 text-muted-foreground" transition:fade>Results</p>
				<div class="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg bg-muted" transition:slide>
					<div class="of-top of-bottom of-length-2 no-scrollbar max-h-[calc(50dvh-200px)] overflow-y-auto">
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
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-auto mb-8">
		<Button size="lg" onclick={saveLocation} disabled={!selectedLocation} class={!selectedLocation ? "opacity-50" : ""}>
			That's the one <Check class="ml-2" />
		</Button>
	</div>
</div>
