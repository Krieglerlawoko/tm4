import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const signIn = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error.response ? error.response.data : { message: 'Error signing in' };
  }
};

const signUp = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error.response ? error.response.data : { message: 'Error signing up' };
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
    throw error.response ? error.response.data : { message: 'Error fetching tasks' };
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
    throw error.response ? error.response.data : { message: 'Error creating task' };
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
    throw error.response ? error.response.data : { message: 'Error updating task' };
  }
};

const deleteTask = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error.response ? error.response.data : { message: 'Error deleting task' };
  }
};

export { signIn, signUp, getTasks, createTask, updateTask, deleteTask };
