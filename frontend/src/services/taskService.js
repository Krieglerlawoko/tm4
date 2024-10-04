import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:5000/api';

// User Authentication Functions
const signUp = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { username, password });
    return response.data; // Returns the response data (e.g., user info or token)
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error; // Propagate the error to be handled by the calling code
  }
};

const signIn = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { username, password });
    return response.data; // Returns the response data (e.g., user info or token)
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw error;
  }
};

// Task Management Functions
const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data; // Returns the list of tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data; // Returns the created task
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data; // Returns the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`); // No return value
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Exporting all functions
export { getTasks, createTask, updateTask, deleteTask, signUp, signIn };
