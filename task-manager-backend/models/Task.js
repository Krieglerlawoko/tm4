const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Task model
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: { // Add userId field to associate tasks with users
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Task;
