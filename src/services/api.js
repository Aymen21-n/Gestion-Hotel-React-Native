import { Platform } from 'react-native';

const DEFAULT_HOST = Platform.select({
  android: 'http://10.0.2.2:3001',
  ios: 'http://localhost:3001',
  default: 'http://localhost:3001',
});

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur.' }));
    throw new Error(error.message || 'Erreur serveur.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
