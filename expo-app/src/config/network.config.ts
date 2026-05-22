/**
 * Network Configuration Helper
 * 
 * Provides functions to detect and manage network connections
 */

import NetInfo from '@react-native-community/netinfo';

/**
 * Get current device IP address information
 * Useful for debugging network connectivity
 */
export const getNetworkInfo = async () => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected,
    type: state.type,
    isInternetReachable: state.isInternetReachable,
    details: state.details,
  };
};

/**
 * Check if device is connected to WiFi
 */
export const isOnWiFi = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.type === 'wifi' && state.isConnected === true;
};

/**
 * Monitor network connectivity changes
 */
export const subscribeToNetworkChanges = (
  callback: (isConnected: boolean) => void
) => {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected ?? false);
  });
};

export default {
  getNetworkInfo,
  isOnWiFi,
  subscribeToNetworkChanges,
};
