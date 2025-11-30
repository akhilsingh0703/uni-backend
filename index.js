const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Import routes
const authRoutes = require('./routes/auth');
const universityRoutes = require('./routes/universities');

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);

// Health check endpoint (required for Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, '0.0.0.0', () => {  // Listen on all network interfaces
  console.log(`Server is running on port ${port}`);
});
