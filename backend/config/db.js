const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure this is at the top to load environment variables

// Create Sequelize instance using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable logging if not needed
});

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
