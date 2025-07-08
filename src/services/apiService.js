// apiService.js
import API from './api';

let onUnauthorized = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorized = callback;
};

const apiService = {
  get: async (url, params = {}) => {
    try {
      const response = await API.get(url, { params });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('dks_liquor_token');
        if (onUnauthorized) onUnauthorized(); // Call the handler
      }
      console.log('GET error:', error?.response?.status);
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      const response = await API.post(url, data);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('dks_liquor_token');
        if (onUnauthorized) onUnauthorized();
      }
      console.error('POST error:', error);
      throw error;
    }
  },

  postWithMedia: async (url, formData) => {
    try {
      const response = await API.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('dks_liquor_token');
        if (onUnauthorized) onUnauthorized();
      }
      console.error('POST with media error:', error);
      throw error;
    }
  }
};

export default apiService;
