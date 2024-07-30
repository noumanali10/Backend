// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();
const buildingRoutes = require('./Routes/building');
const userRoutes = require('./Routes/Users');
const {isAuthenticated} = require('./Middleware/auth');

// Initialize the Express application
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Middleware to handle CORS
app.use(cors());


// MongoDB connection string

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoURI is not defined');
    process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the API routes
app.use('/buildings', buildingRoutes);
app.use('/User', userRoutes);
app.use('/', (req, res) => {
    res.send('Welcome to the building Management System API');
});
app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
})
// Define the port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get('/api/hello', (req, res) => {
//     res.send('Hello World!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

