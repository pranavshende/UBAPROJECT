// src/services/api.ts

// Base URL for backend API
// Android Emulator → use 10.0.2.2 instead of localhost
export const BASE_URL = 'http://192.168.1.2:5000/api';

/**
 * Generic API request function
 */
export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  token?: string
) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
