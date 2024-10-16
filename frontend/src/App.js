import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn } from './services/taskService';
import './App.css';
import logo from './assets/images/prioritize.png'; // Adjust the import path as needed

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('signIn');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');

  // Function to load tasks from the backend
  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    const fetchedTasks = await getTasks(token);
    setTasks(fetchedTasks);
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Task creation function
  const handleCreateTask = async () => {
    await createTask(newTask, token); // Pass token to createTask service function
    setNewTask({ title: '', description: '', dueDate: '' }); // Clear form after submission
    loadTasks(); // Reload tasks
  };

  // Sign-in function
  const handleSignIn = async () => {
    try {
      const data = await signIn({ username, password });
      if (data.token) {
        setIsAuthenticated(true);
        setToken(data.token); // Save token
        localStorage.setItem('token', data.token); // Persist token in local storage
        localStorage.setItem('username', data.user.username); // Save username
        setLoggedInUser(data.user.username); // Set logged in user
        loadTasks(); // Fetch tasks after sign-in
      } else {
        alert('Sign-in failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-in failed!';
      alert(message);
    }
  };

  // Sign-up function
  const handleSignUp = async () => {
    try {
      const data = await signUp({ username, password });
      if (data.message === 'User created!') {
        alert('Sign-up successful, please sign in.');
        setFormType('signIn'); // Automatically switch to the sign-in form
      } else {
        alert('Sign-up failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-up failed!';
      alert(message);
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setLoggedInUser('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setTasks([]);
  };

  // Handle task update (Mark as completed)
  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask, token);
    loadTasks();
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    await deleteTask(id, token);
    loadTasks();
  };

  return (
    <div className="app-container">
      <h1>Task Master</h1>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" style={{ width: '150px', marginBottom: '20px' }} />
      </div>

      {!isAuthenticated ? (
        <div className="auth-form">
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
        <div className="task-board">
          <h2>Welcome, {loggedInUser}</h2>
          <button onClick={handleLogout} className="logout-btn">Logout</button>

          <div className="task-form">
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

          <div className="task-list row">
            {tasks.map((task) => (
              <div key={task.id} className="task-card col-4">
                <div className="card-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                  <p>Status: {task.status}</p>
                  <button
                    className="complete-btn"
                    onClick={() => handleUpdateTask(task.id, { ...task, status: 'Completed' })}
                    disabled={task.status === 'Completed'}
                  >
                    {task.status === 'Completed' ? 'Completed' : 'Mark as Completed'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
