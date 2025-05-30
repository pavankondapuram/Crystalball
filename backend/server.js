const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Ensure express.json() is used for parsing JSON request bodies
app.use(express.json()); 

// Import routes
const forecastRoutes = require('./routes/forecast');
const authRoutes = require('./routes/auth'); 
const integrationRoutes = require('./routes/integration'); // Import the new integration routes

// Use routes
app.use('/api/forecast', forecastRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/integration', integrationRoutes); // Use the integration routes under /api/integration

// Basic error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
