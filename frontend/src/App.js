import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn } from './services/taskService';
import './App.css';
import Dashboard from './Dashboard';
import logo from './assets/images/prioritize.png'; // Ensure this path is correct

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('signIn');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const fetchedTasks = await getTasks(token);
      setTasks(fetchedTasks);
    } catch (error) {
      setError('Failed to load tasks. Please try again.');
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description) {
      alert('Please fill in all fields to create a task.');
      return;
    }
    setLoading(true);
    try {
      await createTask(newTask, token);
      setNewTask({ title: '', description: '', dueDate: '' });
      loadTasks();
    } catch (error) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const data = await signIn({ username, password });
      if (data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        loadTasks();
      } else {
        setError('Sign-in failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-in failed!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = await signUp({ username, password });
      if (data.message === 'User created!') {
        alert('Sign-up successful, please sign in.');
        setFormType('signIn');
      } else {
        setError('Sign-up failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-up failed!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    setLoading(true);
    try {
      await updateTask(id, updatedTask, token);
      loadTasks();
    } catch (error) {
      setError('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      await deleteTask(id, token);
      loadTasks();
    } catch (error) {
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Task Master</h1>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" style={{ width: '150px', marginBottom: '20px' }} />
      </div>
      {error && <p className="error-message">{error}</p>}
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
          <button onClick={formType === 'signIn' ? handleSignIn : handleSignUp} disabled={loading}>
            {loading ? 'Loading...' : (formType === 'signIn' ? 'Sign In' : 'Sign Up')}
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
            <button onClick={handleCreateTask} disabled={loading}>
              {loading ? 'Loading...' : 'Add Task'}
            </button>
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
