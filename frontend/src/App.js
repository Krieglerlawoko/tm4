import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn } from './services/taskService';
import './App.css';
import Dashboard from './Dashboard';
import logo from './assets/images/prioritize.png'; // Adjust the import path as needed

function App() {
  const [tasks, setTasks] = useState([]); // State for tasks
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' }); // State for new task
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [formType, setFormType] = useState('signIn'); // State to toggle between signIn and signUp forms
  const [token, setToken] = useState(localStorage.getItem('token')); // Initialize token from localStorage

  // Load tasks when authenticated
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !token) return; // Only load tasks if authenticated
    try {
      const fetchedTasks = await getTasks(token);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      alert('Error loading tasks. Please try again.'); // Inform the user about the error
    }
  }, [isAuthenticated, token]); // Dependency on isAuthenticated

  useEffect(() => {
    loadTasks(); // Call loadTasks when isAuthenticated changes
  }, [loadTasks]);

  const handleCreateTask = async () => {
    try {
      await createTask(newTask, token);
      setNewTask({ title: '', description: '', dueDate: '' }); // Clear new task input after creation
      loadTasks(); // Reload tasks
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Error creating task. Please try again.'); // Inform the user about the error
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      await updateTask(id, updatedTask);
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Error updating task. Please try again.'); // Inform the user about the error
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Error deleting task. Please try again.'); // Inform the user about the error
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp({ username, password });
      alert('User created! You can now sign in.');
      setFormType('signIn');
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-up failed!'; // Use optional chaining
      alert(message); // Show specific error message
    }
  };

  const handleSignIn = async () => {
    try {
      const data = await signIn({ username, password });
      if (data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('token', data.token); // Save token in localStorage
        loadTasks(); // Load tasks after sign-in
      } else {
        alert('Sign-in failed!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-in failed!'; // Use optional chaining
      alert(message); // Show specific error message
    }
  };

  return (
    <div>
      <h1>Task Master</h1>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" style={{ width: '150px', marginBottom: '20px' }} /> {/* Display the logo */}
      </div>
      {isAuthenticated && <Dashboard tasks={tasks} />} {/* Show Dashboard only when authenticated */}
      {!isAuthenticated ? (
        <div>
          <h2>{formType === 'signIn' ? 'Sign In' : 'Sign Up'}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={formType === 'signIn' ? handleSignIn : handleSignUp}>
            {formType === 'signIn' ? 'Sign In' : 'Sign Up'}
          </button>
          <button onClick={() => setFormType(formType === 'signIn' ? 'signUp' : 'signIn')}>
           Switch to {formType === 'signIn' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      ) : (
        <div>
          <div>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button onClick={handleCreateTask}>Add Task</button>
          </div>

          <div>
            {tasks.map((task) => (
              <div key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <button onClick={() => handleUpdateTask(task._id, { ...task, status: 'Completed' })}>
                  Mark Completed
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
