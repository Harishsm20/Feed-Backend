// authentication-service/models/otpModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Define the OTP model
const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
});

// Sync model with MySQL table
Otp.sync()
  .then(() => console.log('Otp table created'))
  .catch(err => console.log('Error creating table:', err));

module.exports = Otp;
