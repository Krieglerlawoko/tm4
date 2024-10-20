const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Username is required' },
      len: { args: [3, 50], msg: 'Username must be between 3 and 50 characters' },
    },
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required' },
      len: { args: [8, 100], msg: 'Password must be at least 8 characters long' },
    },
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true, // Profile picture is optional
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
