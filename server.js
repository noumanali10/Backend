const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
require('dotenv').config();

const uploads = require('../Backend/Middleware/Multer');
const uploadOnCloudinary = require('../Backend/Services/cloudnary');
const building = require('../Backend/Models/Building');

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

// Define the building routes directly in server.js

// Create a new building
app.post('/buildings', uploads.single('File'), async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.body);

        const { ID, name, Description, lat, lng } = req.body;
        console.log(ID, name, Description, lat, lng);

        const File = req.file;
        console.log(File.path);

        const coordinates = { lat, lng };

        // Upload the file to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(File.path);
        console.log(cloudinaryResponse.url);

        // Create a new building object
        const newbuilding = new building({
            ID,
            name,
            File: cloudinaryResponse.url,
            coordinates,
            Description
        });

        // Save the new building to the database
        await newbuilding.save();

        // Send the saved building object as a response
        res.status(201).json(newbuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all buildings
app.get('/buildings', async (req, res) => {
    try {
        const buildings = await building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a single building by ID
app.get('/buildings/:id', async (req, res) => {
    try {
        const building = await building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read a building by value
app.get('/buildings/search/:SearchQuery', async (req, res) => {
    try {
        console.log("Hit");
        console.log(req.params.SearchQuery);
        const buildings = await building.find({ name: req.params.SearchQuery });
        if (!buildings) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        console.log(error);
    }
});

// Update a building by ID
app.put('/buildings/:id', async (req, res) => {
    try {
        const { name, File, coordinates, Description } = req.body;
        const building = await building.findByIdAndUpdate(
            req.params.id,
            { name, File, coordinates, Description },
            { new: true, runValidators: true }
        );
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Find by coordinates
app.get('/buildings/coordinates/:lat/:lng', async (req, res) => {
    try {
        const { lat, lng } = req.params;
        const buildings = await building.find({ "coordinates.lat": lat, "coordinates.lng": lng });
        if (!buildings) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a building by ID
app.delete('/buildings/:id', async (req, res) => {
    try {
        const building = await building.findByIdAndDelete(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'building not found' });
        }
        res.status(200).json({ message: 'building deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Adjust the import statement to match the actual file name
let userRoutes;
try {
    userRoutes = require('./Routes/Users');
    console.log('Successfully required ./Routes/Users');
} catch (err) {
    console.error('Error requiring ./Routes/Users:', err);
}

// Define the user routes
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
