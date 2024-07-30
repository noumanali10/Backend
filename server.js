// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

// Adjust the import statement to match the actual file name
let buildingRoutes, userRoutes;
try {
    buildingRoutes = require('./Routes/building');
    console.log('Successfully required ./Routes/building');
} catch (err) {
    console.error('Error requiring ./Routes/Building:', err);
}

try {
    userRoutes = require('./Routes/Users');
    console.log('Successfully required ./Routes/Users');
} catch (err) {
    console.error('Error requiring ./Routes/Users:', err);
}

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
if (buildingRoutes) {
    app.use('/buildings', buildingRoutes);
} else {
    console.error('Building routes not defined');
}

if (userRoutes) {
    app.use('/User', userRoutes);
} else {
    console.error('User routes not defined');
}

app.use('/', (req, res) => {
    res.send('Ramu');
});

app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
});

// Define the port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
