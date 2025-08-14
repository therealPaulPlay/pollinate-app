// src/lib/utils/android-back.js
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { page } from '$app/state';

let backButtonListener = null;

export function initializeAndroidBackHandler() {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;

    // Remove existing listener if any
    if (backButtonListener) backButtonListener.remove();

    backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
        const currentPath = page.url.pathname;

        // Define paths where back should exit the app
        const exitPaths = ['/', '/onboarding'];

        if (exitPaths.includes(currentPath)) {
            App.exitApp();
            return;
        }

        // For other pages, use browser-like navigation
        if (canGoBack) window.history.back();
    });
}

export function removeAndroidBackHandler() {
    if (backButtonListener) {
        backButtonListener.remove();
        backButtonListener = null;
    }
}