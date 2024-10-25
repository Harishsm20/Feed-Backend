// authentication-service/models/userModel.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Import the Sequelize instance

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
}, {
  timestamps: true, // This will add createdAt and updatedAt fields automatically
});

// Sync model with MySQL table
User.sync()
  .then(() => console.log('User table created'))
  .catch(err => console.log('Error creating table:', err));

module.exports = User;
