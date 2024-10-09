const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db'); // Import the database connection
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes'); // Updated this line (removed .js)
const { sequelize } = require('./config/db'); // Import sequelize for database sync

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS for the frontend
app.use(express.json()); // Middleware to parse JSON requests

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes

// Function to start the server and sync the database
const startServer = async () => {
  try {
    await connectDB(); // Ensure this connects to your database properly
    await sequelize.sync(); // Sync the Sequelize models with the database
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing the server:', err);
  }
};

// Start the server
startServer();
