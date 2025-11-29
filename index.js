const express = require('express');
const app = express();
const port = process.env.PORT || 3000;  // Use environment variable or default to 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Health check endpoint (required for Cloud Run)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(port, '0.0.0.0', () => {  // Listen on all network interfaces
  console.log(`Server is running on port ${port}`);
});