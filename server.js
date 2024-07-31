const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();
const Users = require('./Routes/Users');
const BuildingsRoutes = require("./Routes/Building")

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

// Use the users router for requests to the /users path
app.use('/users', Users);

// Use the buildings router for requests to the /buildings path
app.use('/buildings', BuildingsRoutes);

// Define the port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
