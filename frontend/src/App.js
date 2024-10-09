import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn } from './services/taskService';
import './App.css';
import Dashboard from './Dashboard';
import logo from './assets/images/prioritize.png'; // Adjust the import path as needed

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('signIn');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    const fetchedTasks = await getTasks(token);
    setTasks(fetchedTasks);
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async () => {
    await createTask(newTask, token);
    setNewTask({ title: '', description: '', dueDate: '' });
    loadTasks();
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask, token);
    loadTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id, token);
    loadTasks();
  };

  const handleSignUp = async () => {
    try {
      await signUp({ username, password });
      alert('User created! You can now sign in.');
      setFormType('signIn');
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-up failed!';
      alert(message);
    }
  };

  const handleSignIn = async () => {
    try {
      const data = await signIn({ username, password });
      if (data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        loadTasks();
      } else {
        alert('Sign-in failed!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-in failed!';
      alert(message);
    }
  };

  return (
    <div>
      <h1>Task Master</h1>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" style={{ width: '150px', marginBottom: '20px' }} />
      </div>
      {isAuthenticated && <Dashboard tasks={tasks} />}
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
