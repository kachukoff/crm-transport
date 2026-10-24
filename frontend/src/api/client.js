const BASE_URL = '/api';

export const api = {
  // Универсальный метод для GET-запросов
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    return response.json();
  },

  // Универсальный метод POST-запросов
  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    return response.json();
  },

  // Универсальный метод для PATCH-запросов
  patch: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    return response.json();
  }
}