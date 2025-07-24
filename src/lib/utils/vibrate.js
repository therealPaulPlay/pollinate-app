import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = () => Capacitor.isNativePlatform();

export const vibrate = {
    light: async () => {
        if (isNative()) await Haptics.impact({ style: ImpactStyle.Light });
    },
    medium: async () => {
        if (isNative()) await Haptics.impact({ style: ImpactStyle.Medium });

    },
    heavy: async () => {
        if (isNative()) await Haptics.impact({ style: ImpactStyle.Heavy });
    }
};