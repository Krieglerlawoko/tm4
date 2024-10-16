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

// CORS configuration to allow requests from your frontend at http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  credentials: true,  // Allows cookies and authorization headers
  allowedHeaders: ['Content-Type', 'Authorization'],  // Custom headers you want to allow
  optionsSuccessStatus: 204  // For legacy browsers (handling of 204 response for OPTIONS request)
}));

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes

// Function to start the server and sync the database
const startServer = async () => {
  try {
    await connectDB(); // Ensure this connects to your database properly
    console.log('Database connected successfully'); // Log on successful DB connection
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
