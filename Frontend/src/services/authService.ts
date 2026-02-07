import { apiRequest } from './api';

export const loginUser = (email: string, password: string) => {
  return apiRequest('/auth/login', 'POST', { email, password });
};

export const registerUser = (
  name: string,
  email: string,
  password: string
) => {
  return apiRequest('/auth/register', 'POST', {
    name,
    email,
    password,
  });
};
