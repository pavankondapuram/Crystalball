const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const forecastRoutes = require('./routes/forecast');
app.use('/api/forecast', forecastRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
