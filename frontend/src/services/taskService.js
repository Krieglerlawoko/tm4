import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const signUp = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
};

const signIn = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

const getTasks = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const createTask = async (taskData, token) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

const updateTask = async (id, taskData, token) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

const deleteTask = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export { getTasks, createTask, updateTask, deleteTask, signUp, signIn };
