import * as SecureStore from 'expo-secure-store';

async function getItem(key: string): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    console.warn('SecureStore getItem error (continuing anyway):', error);
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn('SecureStore setItem error (continuing anyway):', error);
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn('SecureStore removeItem error (continuing anyway):', error);
  }
}

export default {
  getItem,
  setItem,
  removeItem,
};
