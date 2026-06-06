import axios from 'axios';

const api = axios.create({
  // If VITE_API_URL exists, use it. Otherwise, fallback to localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  console.log("Current API URL:", import.meta.env.VITE_API_URL);
});

export default api;
