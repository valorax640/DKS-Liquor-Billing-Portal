import axios from 'axios';
import { API_URL } from '../utils/URL';

const API = axios.create({
  baseURL: `${API_URL}`, 
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dks_liquor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
