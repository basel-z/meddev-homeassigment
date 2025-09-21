import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const treatmentService = {
  // Create a new treatment
  async createTreatment(treatmentData) {
    try {
      const response = await api.post('/treatments', treatmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get all treatments
  async getTreatments() {
    try {
      const response = await api.get('/treatments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Delete a treatment
  async deleteTreatment(treatmentId) {
    try {
      const response = await api.delete(`/treatments/${treatmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

export default treatmentService;