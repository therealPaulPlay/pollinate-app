import { writable } from 'svelte/store';

// Pollen data store
export const pollenData = writable(null);
export const isLoading = writable(true);
export const error = writable(null);

// User preferences
export const userLocation = writable(null);
export const userPollen = writable([]);

// Load user preferences from localStorage
function loadUserPreferences() {
    if (typeof localStorage !== 'undefined') {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) userLocation.set(JSON.parse(savedLocation));

        const savedPollen = localStorage.getItem('userPollen');
        if (savedPollen) userPollen.set(JSON.parse(savedPollen));
    }
}
loadUserPreferences();

// Fetch pollen data
export async function fetchPollenData() {
    isLoading.set(true);
    error.set(null);

    loadUserPreferences();

    try {
        // For now, fetch mock data
        const response = await fetch('/json/mock-api-data.json');
        if (!response.ok) throw new Error('Failed to fetch pollen data');

        const data = await response.json();
        pollenData.set(data);
    } catch (err) {
        console.error('Error fetching pollen data:', err);
        error.set(err.message);
    } finally {
        isLoading.set(false);
    }
}

// Get risk level for user's selected pollen types
export function calculateRiskLevel(data, userPollenTypes) {
    if (!data?.dailyInfo?.[0]?.plantInfo || !userPollenTypes?.length) return 0;

    const todayPlants = data.dailyInfo[0].plantInfo;
    let maxRisk = 0;

    userPollenTypes.forEach(pollenCode => {
        const plant = todayPlants.find(p => p.code === pollenCode);
        if (plant?.indexInfo?.value) maxRisk = Math.max(maxRisk, plant.indexInfo.value);
    });

    return maxRisk;
}