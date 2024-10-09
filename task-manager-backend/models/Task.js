const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the Task model
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
});

module.exports = Task;
