const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const noteRoutes = require('./routes/notes');

// Connect to MongoDB
connectDB();

const app = express();



// 1. Helmet helps secure Express apps by setting various HTTP headers.
// It hides the "X-Powered-By" header and adds XSS protection headers.
app.use(helmet());

// 2. CORS (Cross-Origin Resource Sharing)
// We will configure this later to ONLY accept requests from our specific frontend URL.
app.use(cors());

// 3. Rate Limiting
// This stops brute-force attacks by limiting IP addresses to 100 requests per 15 mins.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);


// Allows us to parse incoming JSON payloads
app.use(express.json());



// Routes
app.use('/api/notes', noteRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'BurnAfterReading API is running securely! 🔒' });
});

//Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
