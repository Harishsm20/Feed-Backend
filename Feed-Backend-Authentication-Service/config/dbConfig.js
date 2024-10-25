// authentication-service/config/dbConfig.js

const { Sequelize } = require('sequelize');

// Create Sequelize instance for MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',  
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
