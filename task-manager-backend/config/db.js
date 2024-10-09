const { Sequelize } = require('sequelize');
const path = require('path');

// Create a new SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/taskmanager.sqlite') // SQLite database file path
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
