import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';

export async function openNativeRating() {
    const isNative = Capacitor.isNativePlatform();

    if (!isNative) {
        console.log("Only available on native platforms!");
        return;
    }

    try {
        await InAppReview.requestReview();
    } catch (error) {
        console.error(error);
    }
}