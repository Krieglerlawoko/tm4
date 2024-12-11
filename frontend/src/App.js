import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, signUp, signIn, deleteAccount } from './services/taskService';
import './App.css';
import logo from './assets/images/prioritize.png';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('signIn');
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture state
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');
  const [userProfilePicture, setUserProfilePicture] = useState(''); // Profile picture

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

  const handleSignIn = async () => {
    try {
      const data = await signIn({ username, password });
      if (data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        setLoggedInUser(data.user.username);
        setUserProfilePicture(data.user.profilePicture); // Sets `profile picture
        loadTasks();
      } else {
        alert('Sign-in failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-in failed!';
      alert(message);
    }
  };

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const data = await signUp(formData);
      if (data.message === 'User created!') {
        alert('Sign-up successful, please sign in.');
        setFormType('signIn');
      } else {
        alert('Sign-up failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign-up failed!';
      alert(message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setLoggedInUser('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setTasks([]);
  };

  const handleUpdateTask = async (id, updatedTask) => {
    await updateTask(id, updatedTask, token);
    loadTasks();
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id, token);
    loadTasks();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(token); // Call the API to delete the account
        alert("Account deleted successfully.");
        handleLogout(); // Log the user out after account deletion
      } catch (error) {
        alert(error.message || "Error deleting account.");
      }
    }
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
          {formType === 'signUp' && (
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])} // Profile picture input
            />
          )}
          <button onClick={formType === 'signIn' ? handleSignIn : handleSignUp}>
            {formType === 'signIn' ? 'Sign In' : 'Sign Up'}
          </button>
          <button onClick={() => setFormType(formType === 'signIn' ? 'signUp' : 'signIn')}>
            Switch to {formType === 'signIn' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      ) : (
        <div className="task-board">
          <div className="profile-section">
            {userProfilePicture && (
              <img
                src={`http://localhost:5000/${userProfilePicture}`}
                alt="Profile"
                className="profile-picture"
                style={{ width: '100px', borderRadius: '50%' }}
              />
            )}
            <h2>Welcome, {loggedInUser}</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            <button onClick={handleDeleteAccount} className="delete-account-btn">Delete Account</button>
          </div>

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
