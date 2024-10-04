import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn } from './services/taskService';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [tasks, setTasks] = useState([]); // State for tasks
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' }); // State for new task
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [token, setToken] = useState(null); // Token state
  const [username, setUsername] = useState(''); // Username state
  const [password, setPassword] = useState(''); // Password state
  const [formType, setFormType] = useState('signIn'); // State to toggle between signIn and signUp forms

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks(); // Load tasks if authenticated
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    const fetchedTasks = await getTasks(); // Assume this returns tasks for the authenticated user
    setTasks(fetchedTasks);
  };

  const handleCreateTask = async () => {
    await createTask(newTask);
    loadTasks(); // Reload tasks after creation
    setNewTask({ title: '', description: '', dueDate: '' }); // Reset new task form
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask);
    loadTasks(); // Reload tasks after update
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    loadTasks(); // Reload tasks after deletion
  };

  const handleSignUp = async () => {
    await signUp({ username, password });
    alert('User created! You can now sign in.');
    setFormType('signIn'); // Switch to sign-in form after sign-up
  };

  const handleSignIn = async () => {
    const data = await signIn({ username, password });
    if (data.token) {
      setIsAuthenticated(true);
      setToken(data.token);
      localStorage.setItem('token', data.token); // Save token in localStorage
      loadTasks(); // Load tasks after sign-in
    } else {
      alert('Sign-in failed!');
    }
  };

  return (
    <div>
      <h1>Task Master</h1>
      
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
          <Dashboard tasks={tasks} /> {/* Show the dashboard only when authenticated */}
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
