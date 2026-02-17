// utils/safeArea.ts
import { Platform, StatusBar } from 'react-native';

export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    return 60; // Standard iOS status bar + safe area
  }
  return StatusBar.currentHeight || 0 + 24; // Android status bar + extra padding
};

export const getBottomSpace = (): number => {
  if (Platform.OS === 'ios') {
    return 34; // iOS home indicator area
  }
  return 24; // Android extra bottom padding
};