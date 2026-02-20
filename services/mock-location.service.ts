import { NativeModules, Platform } from 'react-native';

type MockLocationNativeModule = {
  setMockLocation: (latitude: number, longitude: number) => Promise<void> | void;
  startStatusNotification: (latitude: number, longitude: number) => Promise<void> | void;
};

const { MockLocationModule } = NativeModules as {
  MockLocationModule?: MockLocationNativeModule;
};

export const setMockLocationNative = async (latitude: number, longitude: number): Promise<void> => {
  console.log('[mock-location.service] setMockLocationNative called', { latitude, longitude });

  if (Platform.OS !== 'android') {
    throw new Error('Mock location is only supported on Android');
  }

  if (!MockLocationModule?.setMockLocation) {
    throw new Error('MockLocationModule is not available. Rebuild with npx expo run:android (not Expo Go).');
  }

  await MockLocationModule.setMockLocation(latitude, longitude);
  console.log('[mock-location.service] native setMockLocation finished');
};

export const startStatusNotificationNative = async (latitude: number, longitude: number): Promise<void> => {
  console.log('[mock-location.service] startStatusNotificationNative called', { latitude, longitude });

  if (Platform.OS !== 'android') {
    return;
  }

  if (!MockLocationModule?.startStatusNotification) {
    console.log('[mock-location.service] startStatusNotification not available');
    return;
  }

  try {
    await MockLocationModule.startStatusNotification(latitude, longitude);
    console.log('[mock-location.service] native startStatusNotification finished');
  } catch (error) {
    console.error('[mock-location.service] native startStatusNotification failed', error);
  }
};
