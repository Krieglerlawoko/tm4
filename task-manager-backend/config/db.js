const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || path.join(__dirname, '../database/taskmanager.sqlite'), // SQLite database file path
});

// Test the connection and log success/failure
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the sequelize instance and connectDB function
module.exports = { sequelize, connectDB };
