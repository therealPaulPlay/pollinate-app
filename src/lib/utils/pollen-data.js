import { writable } from 'svelte/store';

// Pollen data store
export const pollenData = writable(null);
export const isLoading = writable(true);

// User preferences
export const userLocation = writable(null);
export const userPollen = writable([]);

// API configuration
const API_BASE_URL = 'https://pollen.openreport.dev';

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

// Fetch pollen data from API
export async function fetchPollenData() {
    isLoading.set(true);
    loadUserPreferences();

    try {
        // Get user location
        const savedLocation = localStorage.getItem('userLocation');
        if (!savedLocation) throw new Error('No location saved!');

        const location = JSON.parse(savedLocation);
        if (!location.lat || !location.lon) throw new Error('Provided location is invalid!');

        // Fetch from API
        const response = await fetch(
            `${API_BASE_URL}/pollen-data?lat=${location.lat}&lon=${location.lon}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error(response.status);

        const data = await response.json();
        pollenData.set(data);
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