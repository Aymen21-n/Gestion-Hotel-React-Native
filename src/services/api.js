export const API_URL = 'http://localhost:3001';

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
