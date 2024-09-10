const express = require('express');
const sequelize = require('./config/db'); // Import sequelize
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
require('dotenv').config();


// Initialize express
const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json()); // Replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded({ extended: true })

// Security and performance middleware
// app.use(helmet());
// app.use(compression());

// Middleware
app.use(passport.initialize());

// Logging middleware (order matters here)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/users', userRoutes); // User management routes
app.use('/projects', projectRoutes); // Project management routes
app.use('/roles', roleRoutes); // Role management routes
app.use('/audit-logs', auditLogRoutes); // Audit logs route (Admin only)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Initialize Sequelize and sync models

// Sync Sequelize models
sequelize.sync({ alter: true }) // Use alter for updating tables without dropping them
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.log('Error syncing the database: ', err);
  });


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
