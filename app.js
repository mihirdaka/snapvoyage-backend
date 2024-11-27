const express = require('express');
const cors = require('cors');
const pinterestRoutes = require('./routes/pinterestRoutes.js');
const pinterestController = require('./controllers/photoController.js');
const cookieParser = require('cookie-parser');

const app = express();
// const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies and Authorization headers
  };
// Middleware
app.use(cors(corsOptions));  // Use the CORS middleware with the configured options
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/pinterest', pinterestRoutes);
app.get('/auth/callback', pinterestController.pinterestCallback);


// Start Server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
