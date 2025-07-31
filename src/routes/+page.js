import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export function load() {
    if (browser) {
        const onboardingComplete = localStorage.getItem('onboardingCompleted');
        if (!onboardingComplete) redirect(302, '/onboarding');
    }
    return {};
}