// authentication-service/models/userModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Define the User model with explicit table name
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'users', // Explicitly set the table name to 'users'
});

// Sync model with MySQL table
User.sync()
  .then(() => console.log('Users table created'))
  .catch(err => console.log('Error creating table:', err));

module.exports = User;
