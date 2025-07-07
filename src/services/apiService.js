import API from './api';

const apiService = {
  // GET request
  get: async (url, params = {}) => {
    try {
      const response = await API.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('GET error:', error);
      throw error;
    }
  },

  // POST request with JSON body
  post: async (url, data) => {
    try {
      const response = await API.post(url, data);
      return response.data;
    } catch (error) {
      console.error('POST error:', error);
      throw error;
    }
  },

  // POST request with media (multipart/form-data)
  postWithMedia: async (url, formData) => {
    try {
      const response = await API.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('POST with media error:', error);
      throw error;
    }
  }
};

export default apiService;
