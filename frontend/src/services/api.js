import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const generateResume = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, formData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate resume', { cause: error });
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch history', { cause: error });
  }
};
