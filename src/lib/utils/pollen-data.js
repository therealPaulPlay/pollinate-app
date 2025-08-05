import { writable } from 'svelte/store';

// Pollen data store
export const pollenData = writable(null);
export const isLoading = writable(true);

// User preferences
export const userLocation = writable(null);
export const userPollen = writable([]);

// Show limited data info
export const showLimitedDataInfo = writable(false);

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
        const savedLocation = localStorage.getItem('userLocation');
        if (!savedLocation) throw new Error('No location saved!');

        const location = JSON.parse(savedLocation);
        if (!location.lat || !location.lon) throw new Error('Provided location is invalid!');

        const response = await fetch(
            `${API_BASE_URL}/pollen-data?lat=${location.lat}&lon=${location.lon}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
export function calculateRiskLevel(dayData, userPollenTypes) {
    let maxRisk = 0;

    userPollenTypes?.forEach(pollenCode => {
        const level = getPollenLevel({ dailyInfo: [dayData] }, 0, pollenCode);
        if (level > 0) maxRisk = Math.max(maxRisk, level);
    });

    return maxRisk;
}

// Get pollen level for a specific pollen type with fallback to 0
export function getPollenLevel(data, dayIndex, pollenCode) {
    if (!data?.dailyInfo?.[dayIndex]) return 0;
    const dayData = data.dailyInfo[dayIndex];

    // Check plantInfo
    const plant = dayData.plantInfo?.find(p => p.code === pollenCode);
    if (plant?.indexInfo?.value) return plant.indexInfo.value;
    return 0;
}