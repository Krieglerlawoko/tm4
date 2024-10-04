import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const signUp = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

const signIn = async (userData) => {
  const response = await axios.post(`${API_URL}/signin`, userData);
  return response.data;
};

export { signUp, signIn };
